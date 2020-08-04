using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Web.Leaderboard;
using Web.Rounds;
using Web.Users;

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
        public IActionResult GetLeaderboard([FromQuery] bool onlyFriends, [FromQuery] int month = 0)
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var playersStats =
                _leaderboardCache.GetOrCreate(onlyFriends ? $"{username}-{month}" : month.ToString(),
                    () => GetLeaderboardForMonth(month, onlyFriends, username));


            return Ok(playersStats);
        }

        [HttpGet("hallOfFame")]
        public IActionResult GetHallOfFame()
        {
            var username = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var hallOfFame = _documentSession.Query<HallOfFame>().Single();
            return Ok(hallOfFame);
        }

        private List<PlayerStats> GetLeaderboardForMonth(int month, bool onlyFriends, string username)
        {
            var user = _documentSession.Query<User>().Single(u => u.Username == username);
            var friendsAndMe = user.Friends.Concat(new[] {username}).ToArray();

            var rounds = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.IsCompleted)
                .ToList();

            if (onlyFriends) rounds = rounds.Where(r => r.PlayerScores.Any(s => friendsAndMe.Any(x => x == s.PlayerName))).ToList();

            var roundsThisMonth = rounds
                .Where(r => r.StartTime.Year == DateTime.Now.Year && (month == 0 || r.StartTime.Month == month)).ToList();

            var playersStats = roundsThisMonth
                .CalculatePlayerStats()
                .OrderBy(x => x.CourseAdjustedAverageScore);

            return playersStats.Take(10).ToList();
        }
    }
}