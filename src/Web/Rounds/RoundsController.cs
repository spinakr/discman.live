using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Courses;

namespace Web.Matches
{
    [Authorize]
    [ApiController]
    [Route("api/rounds")]
    public class RoundsController : ControllerBase
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
                .SingleOrDefault(x => x.Id == roundId);
            if (round is null)
            {
                return NotFound();
            }

            if (round.Players.All(p => p != username))
            {
                return Unauthorized("You are not part of the round");
            }

            return Ok(round);
        }

        [HttpGet]
        public IActionResult GetUserRounds([FromQuery] string username, [FromQuery] int start = 0)
        {
            var rounds = _documentSession
                .Query<Round>()
                .Where(r => r.Players.Any(p => p == username))
                .OrderByDescending(x => x.StartTime)
                .Skip(start)
                .Take(5);
            return Ok(rounds);
        }

        [HttpPost]
        public IActionResult StartNewRound([FromBody] NewRoundsRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var players = request.Players;
            if (!players.Any()) players.Add(username);

            var course = _documentSession
                .Query<Course>()
                .Single(x => x.Id == request.CourseId);

            var round = new Round(course, request.Players);
            _documentSession.Store(round);
            _documentSession.SaveChanges();

            return Ok(round);
        }

        [HttpPut("{roundId}/scores")]
        public async Task<IActionResult> UpdateScore(Guid roundId, [FromBody] UpdateScoreRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(x => x.Id == roundId);

            var (isAuthorized, result) = IsUserAuthorized(request.Username, username, round);
            if (!isAuthorized) return result;

            round.Scores
                .Single(s => s.Hole.Number == request.Hole)
                .UpdateScore(username, request.Strokes);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync();

            await _roundsHub.Clients.Group(round.Id.ToString()).SendAsync("roundUpdated",
                JsonConvert.SerializeObject(round, new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()}));

            return Ok(round);
        }

        private (bool, IActionResult) IsUserAuthorized(string requestedUsername, string authenticatedUsername, Round round)
        {
            if (round is null) return (false, NotFound());
            if (round.Players.Any(p => p == authenticatedUsername) && requestedUsername == authenticatedUsername) return (true, Ok());
            return (false, Unauthorized("Cannot update other players rounds"));
        }
    }

    public class UpdateRoundRequest
    {
        public string CourseName { get; set; }
        public List<string> NewPlayers { get; set; }
    }

    public class UpdateScoreRequest
    {
        public int Hole { get; set; }
        public int Strokes { get; set; }
        public string Username { get; set; }
    }

    public class NewRoundsRequest
    {
        public Guid CourseId { get; set; }
        public List<string> Players { get; set; }
    }
}