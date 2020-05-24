using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Web.Rounds;

namespace Web.Matches
{
    [Authorize]
    [ApiController]
    [Route("api/leaderboard")]
    public partial class LeaderboardController : ControllerBase
    {
        private readonly ILogger<LeaderboardController> _logger;
        private readonly IDocumentSession _documentSession;
        private readonly LeaderboardCache _leaderboardCache;

        public LeaderboardController(ILogger<LeaderboardController> logger, IDocumentSession documentSession, LeaderboardCache leaderboardCache)
        {
            _logger = logger;
            _documentSession = documentSession;
            _leaderboardCache = leaderboardCache;
        }

        [HttpGet]
        public IActionResult GetLeaderboard([FromQuery] int month = 0)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var playersStats = _leaderboardCache.GetOrCreate(month, () => GetLeaderboardForMonth(month));

            return Ok(playersStats);
        }

        private List<PlayerStats> GetLeaderboardForMonth(int month)
        {
            var rounds = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => month == 0 || r.StartTime.Month == month)
                .Where(r => r.IsCompleted)
                .ToList();

            var playersStats = rounds
                .SelectMany(r => r.PlayerScores)
                .GroupBy(s => s.PlayerName)
                .Where(x => x.Count() > 5)
                .Select(g =>
                {
                    var avg = g.Average(s => s.Scores.Average(x => x.RelativeToPar));
                    var roundCount = g.Count();
                    return new PlayerStats {Username = g.Key, AverageHoleScore = avg, RoundCount = roundCount};
                })
                .OrderBy(x => x.AverageHoleScore);
            return playersStats.ToList();
        }
    }

    public class PlayerStats
    {
        public string Username { get; set; }
        public double AverageHoleScore { get; set; }
        public int RoundCount { get; set; }
    }
}