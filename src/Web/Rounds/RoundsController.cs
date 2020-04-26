using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Web.Courses;

namespace Web.Matches
{
    [Authorize]
    [ApiController]
    [Route("api/rounds")]
    public class RoundsController : ControllerBase
    {
        private readonly ILogger<RoundsController> _logger;
        private readonly IDocumentSession _documentSession;

        public RoundsController(ILogger<RoundsController> logger, IDocumentSession documentSession)
        {
            _logger = logger;
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
        public IActionResult GetUserRounds([FromQuery]string username, [FromQuery]int start = 0 )
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
            var holes = new List<Hole>();
            for (int i = 1; i < 19; i++)
            {
                holes.Add(new Hole(i, 3));
            }

            var course = new Course {Name = "Muselunden", Holes = holes};
            var round = new Round(course, request.Players);
            _documentSession.Store(round);
            _documentSession.SaveChanges();

            return Ok();
        }
        
        [HttpPut("{roundId}/scores")]
        public IActionResult UpdateScore(Guid roundId, [FromBody] UpdateScoreRequest request)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            
            var round = _documentSession
                .Query<Round>()
                .SingleOrDefault(x => x.Id == roundId);
            if (round is null)
            {
                return NotFound();
            }

            if (round.Players.All(p => p != username) || request.Username != username)
            {
                return Unauthorized("Cannot update other players rounds");
            }

            round.Scores
                .Single(s => s.Hole.Number == request.Hole)
                .UpdateScore(username, request.Strokes);

            _documentSession.Update(round);
            _documentSession.SaveChanges();
            
            return Ok(round);
        }
    }

    public class UpdateScoreRequest
    {
        public int Hole { get; set; }
        public int Strokes { get; set; }
        public string Username { get; set; }
    }

    public class NewRoundsRequest
    {
        public string Course { get; set; }
        public List<string> Players { get; set; }
        
    }
}
