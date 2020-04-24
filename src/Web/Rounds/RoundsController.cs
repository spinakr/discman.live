using System;
using System.Collections.Generic;
using System.Linq;
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

        [HttpGet("{username}")]
        public IActionResult GetUserRounds(string username)
        {
            var rounds = _documentSession.Query<Round>().Where(r => r.Players.Any(p => p == username));
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
    }

    public class NewRoundsRequest
    {
        public string Course { get; set; }
        public List<string> Players { get; set; }
        
    }
}
