using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Baseline;
using Marten;
using Marten.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Serilog;
using Web.Courses;
using Web.Rounds;
using Web.Users;

namespace Web.Matches
{
    [Authorize]
    [ApiController]
    [Route("api/rounds")]
    public partial class RoundsController : ControllerBase
    {
        private readonly ILogger<RoundsController> _logger;
        private readonly IHubContext<RoundsHub> _roundsHub;
        private readonly IDocumentSession _documentSession;

        public RoundsController(ILogger<RoundsController> logger, IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _logger = logger;
            _roundsHub = roundsHub;
            _documentSession = documentSession;
        }

        [HttpGet("{roundId}")]
        public IActionResult GetRound(Guid roundId)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .SingleOrDefault(x => x.Id == roundId);
            if (round is null)
            {
                return NotFound();
            }

            return Ok(round);
        }

        [HttpGet]
        public IActionResult GetUserRounds([FromQuery] string username, [FromQuery] int start = 0, [FromQuery] int count = 5)
        {
            var rounds = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.PlayerScores.Any(p => p.PlayerName == username))
                .OrderByDescending(x => x.StartTime)
                .Skip(start)
                .Take(count);

            return Ok(rounds);
        }

        [HttpPost]
        public async Task<IActionResult> StartNewRound([FromBody] NewRoundsRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var players = request.Players.Select(p => p.ToLower()).ToList();
            if (!players.Any()) players.Add(username);

            var course = _documentSession
                .Query<Course>()
                .SingleOrDefault(x => x.Id == request.CourseId);

            var justStartedRound = await _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => !r.IsCompleted)
                .Where(r => r.PlayerScores.Any(s => s.PlayerName == username))
                .SingleOrDefaultAsync(r => r.StartTime > DateTime.Now.AddMinutes(-10));
            if (justStartedRound is object) return Conflict(justStartedRound);

            var round = course != null
                ? new Round(course, players, username, request.RoundName, request.ScoreMode)
                : new Round(players, username, request.RoundName, request.ScoreMode);
            _documentSession.Store(round);
            _documentSession.SaveChanges();

            return Ok(round);
        }

        [HttpPost("{roundId}/holes")]
        public async Task<IActionResult> AddHole(Guid roundId, [FromBody] AddHoleRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession.Query<Round>().SingleAsync(r => r.Id == roundId);
            var (isAuthorized, result) = IsUserAuthorized(round);
            if (!isAuthorized) return result;

            round.AddHole(request.HoleNumber, request.Par, request.Length);

            await PersistUpdatedRound(round);
            return Ok(round);
        }
        
        [HttpDelete("{roundId}/users")]
        public async Task<IActionResult> LeaveRound(Guid roundId)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = await _documentSession
                .Query<Round>().SingleAsync(x => x.Id == roundId);

            round.PlayerScores = round.PlayerScores.Where(s => s.PlayerName != username).ToList();

            _documentSession.Update(round);
            await PersistUpdatedRound(round);
            return Ok();
        }

        [HttpDelete("{roundId}")]
        public async Task<IActionResult> DeleteRound(Guid roundId)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = await _documentSession
                .Query<Round>().SingleAsync(x => x.Id == roundId);

            if (round.CreatedBy != username) return Forbid("Only rounds created by yourself can be deleted");

            _documentSession.Delete(round);
            await _documentSession.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{roundId}/holes/{holeNumber}")]
        public async Task<IActionResult> DeleteHole(Guid roundId, int holeNumber)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = await _documentSession
                .Query<Round>().SingleAsync(x => x.Id == roundId);

            if (round.CreatedBy != username) return Forbid("Only rounds created by yourself can be modified");

            foreach (var playerScore in round.PlayerScores)
            {
                playerScore.Scores = playerScore.Scores.Where(s => s.Hole.Number != holeNumber).ToList();
            }

            await PersistUpdatedRound(round);
            return Ok();
        }

        [HttpPut("{roundId}/scores")]
        public async Task<IActionResult> UpdateScore(Guid roundId, [FromBody] UpdateScoreRequest request)
        {
            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(x => x.Id == roundId);

            var (isAuthorized, result) = IsUserAuthorized(round, request.Username);
            if (!isAuthorized) return result;

            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            round.PlayerScores
                .Single(p => p.PlayerName == authenticatedUsername).Scores
                .Single(s => s.Hole.Number == request.Hole)
                .UpdateScore(request.Strokes, request.StrokeOutcomes);

            await PersistUpdatedRound(round);

            return Ok(round);
        }


        [HttpPut("{roundId}/complete")]
        public async Task<IActionResult> CompleteRound(Guid roundId)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == roundId);

            var (isAuthorized, result) = IsUserAuthorized(round);
            if (!isAuthorized) return result;

            round.CompleteRound();

            var newUserAchievements = EvaluateAchievements(round);
            if (round.Achievements is null) round.Achievements = new List<Achievement>();
            round.Achievements.AddRange(newUserAchievements);

            await PersistUpdatedRound(round);
            return Ok();
        }

        [HttpPost("{roundId}/savecourse")]
        public async Task<IActionResult> CompleteRound(Guid roundId, [FromBody] SaveCourseRequest request)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == roundId);
            round.CourseName = request.CourseName;

            var (isAuthorized, result) = IsUserAuthorized(round);
            if (!isAuthorized) return result;

            var holes = round
                .PlayerScores
                .First().Scores
                .Select(x => new Hole(x.Hole.Number, x.Hole.Par, x.Hole.Distance))
                .ToList();

            var newCourse = new Course(request.CourseName, holes);
            _documentSession.Store(newCourse);
            await PersistUpdatedRound(round);

            return Ok(newCourse);
        }


        [HttpGet("{roundId}/stats")]
        public async Task<IActionResult> GetStatsOnCourse(Guid roundId)
        {
            var activeRound = await _documentSession
                .Query<Round>()
                .SingleAsync(r => r.Id == roundId);
            var courseName = activeRound.CourseName;
            var players = activeRound.PlayerScores.Select(p => p.PlayerName);


            var playersStats = new List<PlayerCourseStats>();
            if (courseName is null) return Ok(playersStats);
            foreach (var player in players)
            {
                var allRoundsOnCourse = _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.CourseName == courseName)
                    .Where(r => r.PlayerScores.Any(s => s.PlayerName == player))
                    .ToList();

                var fivePreviousRounds = allRoundsOnCourse
                    .Where(r => r.StartTime < activeRound.StartTime)
                    .OrderByDescending(r => r.StartTime)
                    .Take(5)
                    .ToList();

                if (fivePreviousRounds.Count == 0) continue;

                var courseScores = fivePreviousRounds.Select(r => r.PlayerScore(player));
                var currentCourseAverage = courseScores.Average();
                var thisRound = activeRound
                    .PlayerScores
                    .Single(s => s.PlayerName == player)
                    .Scores.Sum(s => s.RelativeToPar);

                playersStats.Add(new PlayerCourseStats
                {
                    PlayerName = player,
                    CourseName = courseName,
                    CourseAverage = currentCourseAverage,
                    NumberOfRounds = allRoundsOnCourse.Count,
                    ThisRoundVsAverage = thisRound - currentCourseAverage
                });
            }


            return Ok(playersStats.OrderBy(s => s.ThisRoundVsAverage));
        }

        [HttpPut("{roundId}/scoremode")]
        public async Task<IActionResult> SetScoreMode(Guid roundId, [FromBody] ChangeScoreModeRequest req)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == roundId);

            var (isAuthorized, result) = IsUserAuthorized(round);
            if (!isAuthorized) return result;
            round.ScoreMode = req.ScoreMode;
            await PersistUpdatedRound(round);
            return Ok();
        }

        private async Task PersistUpdatedRound(Round round)
        {
            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync();
            await _roundsHub.Clients.Group(round.Id.ToString()).SendAsync("roundUpdated",
                JsonConvert.SerializeObject(round, new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()}));
        }

        private (bool, IActionResult) IsUserAuthorized(Round round, string requestedUsername = null)
        {
            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            requestedUsername ??= authenticatedUsername;
            if (round is null) return (false, NotFound());
            if (round.PlayerScores.Any(p => p.PlayerName == authenticatedUsername) && requestedUsername == authenticatedUsername) return (true, Ok());
            return (false, Unauthorized("Cannot update other players rounds"));
        }

        private IEnumerable<Achievement> EvaluateAchievements(Round round)
        {
            var userNames = round.PlayerScores.Select(s => s.PlayerName).ToArray();

            var users = _documentSession
                .Query<User>()
                .Where(u => u.Username.IsOneOf(userNames));


            var newUserAchievements = new List<Achievement>();
            foreach (var userInRound in users)
            {
                if (userInRound.Achievements is null) userInRound.Achievements = new Achievements();
                var roundAchievements = userInRound.Achievements.EvaluatePlayerRound(round.Id, userInRound.Username, round);

                var now = DateTime.Now;
                var rounds = _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == userInRound.Username))
                    .Where(r => r.IsCompleted)
                    .Where(r => r.CompletedAt > new DateTime(now.Year, 1, 1))
                    .ToList();

                var userRounds = rounds.Concat(new List<Round> {round}).ToList();

                var userAchievements = userInRound.Achievements.EvaluateUserRounds(userRounds, userInRound.Username);

                var newAchievements = roundAchievements.Concat(userAchievements).ToList();

                if (!newAchievements.Any()) continue;
                _documentSession.Update(userInRound);
                newUserAchievements.AddRange(newAchievements);
            }

            return newUserAchievements;
        }
    }

    public class SaveCourseRequest
    {
        public string CourseName { get; set; }
    }

    public class ChangeScoreModeRequest
    {
        public ScoreMode ScoreMode { get; set; }
    }

    public class NewRoundsRequest
    {
        public Guid CourseId { get; set; }
        public string RoundName { get; set; }
        public List<string> Players { get; set; }
        public ScoreMode ScoreMode { get; set; }
    }


    public class AddHoleRequest
    {
        public int HoleNumber { get; set; }
        public int Par { get; set; }
        public int Length { get; set; }
    }

    public class UpdateScoreRequest
    {
        public int Hole { get; set; }
        public int Strokes { get; set; }
        public string Username { get; set; }

        public string[] StrokeOutcomes { get; set; }
    }
}