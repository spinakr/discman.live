using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Baseline;
using Marten;
using Marten.Linq;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Serilog;
using Web.Courses;
using Web.Infrastructure;
using Web.Rounds;
using Web.Rounds.Commands;
using Web.Rounds.Domain;
using Web.Rounds.Queries;
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
        private readonly IMediator _mediator;
        private readonly IDocumentSession _documentSession;

        public RoundsController(ILogger<RoundsController> logger, IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub, IMediator mediator)
        {
            _logger = logger;
            _roundsHub = roundsHub;
            _mediator = mediator;
            _documentSession = documentSession;
        }

        [HttpGet("{roundId}")]
        public async Task<IActionResult> GetRound(Guid roundId)
        {
            var round = await _mediator.Send(new GetRoundQuery {RoundId = roundId});
            return Ok(round);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRounds([FromQuery] string username, [FromQuery] int start = 0, [FromQuery] int count = 5)
        {
            var rounds = await _mediator.Send(new GetUserRoundsQuery {Username = username, Start = start, Count = count});
            return Ok(rounds);
        }

        [HttpPost]
        public async Task<IActionResult> StartNewRound([FromBody] NewRoundsRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _mediator.Send(new StartNewRoundCommand
            {
                RoundName = request.RoundName,
                Players = request.Players,
                CourseId = request.CourseId,
                ScoreMode = request.ScoreMode,
            });

            if (round.CreatedBy != username) return Conflict(round);
            return Ok(round);
        }

        [HttpPost("{roundId}/holes")]
        public async Task<IActionResult> AddHole(Guid roundId, [FromBody] AddHoleRequest request)
        {
            var round = await _mediator.Send(new AddHoleCommand
            {
                HoleNumber = request.HoleNumber,
                Length = request.Length,
                Par = request.Par,
                RoundId = roundId
            });
            
            return Ok(round);
        }

        [HttpDelete("{roundId}/users")]
        public async Task<IActionResult> LeaveRound(Guid roundId)
        {
            await _mediator.Send(new LeaveRoundCommand {RoundId = roundId});
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
        public async Task<IActionResult> SaveCourse(Guid roundId, [FromBody] SaveCourseRequest request)
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
        public async Task<IActionResult> GetRoundStatsOnCourse(Guid roundId)
        {
            return Ok(await _mediator.Send(new GetPlayersCourseStatsQuery {RoundId = roundId}));
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