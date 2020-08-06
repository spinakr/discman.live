using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Web.Leaderboard.Queries;

namespace Web.Leaderboard
{
    [Authorize]
    [ApiController]
    [Route("api/leaderboard")]
    public class LeaderboardController : ControllerBase
    {
        private readonly ILogger<LeaderboardController> _logger;
        private readonly IDocumentSession _documentSession;
        private readonly IMediator _mediator;

        public LeaderboardController(ILogger<LeaderboardController> logger, IDocumentSession documentSession, IMediator mediator)
        {
            _logger = logger;
            _documentSession = documentSession;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaderboard([FromQuery] bool onlyFriends, [FromQuery] int month = 0)
        {
            var playersStats = await _mediator.Send(new GetLeaderboardQuery {OnlyFriends = onlyFriends, Month = month});
            return Ok(playersStats);
        }

        [HttpGet("hallOfFame")]
        public async Task<IActionResult> GetHallOfFame()
        {
            return Ok(await _mediator.Send(new GetHallOfFameQuery()));
        }
    }
}