using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Matches;
using Web.Rounds;
using Web.Users;

namespace Web.Leaderboard.Queries
{
    public class GetLeaderboardQuery : IRequest<List<PlayerStats>>
    {
        public bool OnlyFriends { get; set; }
        public int Month { get; set; }
    }

    public class GetLeaderboardQueryHandler : IRequestHandler<GetLeaderboardQuery, List<PlayerStats>>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly LeaderboardCache _leaderboardCache;

        public GetLeaderboardQueryHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, LeaderboardCache leaderboardCache)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _leaderboardCache = leaderboardCache;
        }

        public async Task<List<PlayerStats>> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var playersStats = await _leaderboardCache
                .GetOrCreate(request.OnlyFriends ? $"{username}-{request.Month}" : request.Month.ToString(),
                    async () => await GetLeaderboardForMonth(request.Month, request.OnlyFriends, username));

            return playersStats;
        }

        private async Task<List<PlayerStats>> GetLeaderboardForMonth(int month, bool onlyFriends, string username)
        {
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == username);
            var friendsAndMe = user.Friends.Concat(new[] { username }).ToArray();

            var rounds = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.IsCompleted)
                .ToList();

            if (onlyFriends) rounds = rounds.Where(r => r.PlayerScores.Any(s => friendsAndMe.Any(x => x == s.PlayerName))).ToList();

            var roundsThisMonth = rounds
                .Where(r => r.StartTime.Year == DateTime.Now.Year && (month == 0 || r.StartTime.Month == month)).ToList();

            if (!roundsThisMonth.Any()) return new List<PlayerStats>();

            var playersStats = roundsThisMonth
                .CalculatePlayerStats()
                .OrderBy(x => x.CourseAdjustedAverageScore);

            return playersStats.Take(10).ToList();
        }
    }
}