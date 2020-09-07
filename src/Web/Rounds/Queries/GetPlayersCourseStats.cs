using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Web.Rounds;

namespace Web.Rounds.Queries
{
    public class GetPlayersCourseStatsQuery : IRequest<List<PlayerCourseStats>>
    {
        public Guid RoundId { get; set; }
    }

    public class GetPlayersCourseStatsQueryHandler : IRequestHandler<GetPlayersCourseStatsQuery, List<PlayerCourseStats>>
    {
        private readonly IDocumentSession _documentSession;

        public GetPlayersCourseStatsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<List<PlayerCourseStats>> Handle(GetPlayersCourseStatsQuery request, CancellationToken cancellationToken)
        {
            var activeRound = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(r => r.Id == request.RoundId, token: cancellationToken);

            if (activeRound is null)
            {
                return new List<PlayerCourseStats>();
            }
            
            var courseName = activeRound.CourseName;
            var layoutName = activeRound.CourseLayout;
            var players = activeRound.PlayerScores.Select(p => p.PlayerName);


            var playersStats = new List<PlayerCourseStats>();
            if (courseName is null) return playersStats;
            foreach (var player in players)
            {
                var playerRounds = _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.IsCompleted)
                    .Where(r => r.PlayerScores.Count > 1)
                    .Where(r => r.CourseName == courseName && r.CourseLayout == layoutName)
                    .Where(r => r.PlayerScores.Any(s => s.PlayerName == player))
                    .ToList();

                var playerHoleScores = playerRounds.SelectMany(r => r.PlayerScores.Single(p => p.PlayerName == player).Scores);
                var bestSCores = playerHoleScores.GroupBy(x => x.Hole.Number).Select(x => x.Min(y => y.RelativeToPar));

                var playerCourseRecord = playerRounds.Any() ? playerRounds.Select(r => r.PlayerScore(player)).Min() : (int?) null;

                var fivePreviousRounds = playerRounds
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

                var playerHoleAverages = fivePreviousRounds
                    .SelectMany(r => r.PlayerScores.Where(s => s.PlayerName == player))
                    .SelectMany(s => s.Scores)
                    .GroupBy(s => s.Hole.Number)
                    .ToDictionary(x => x.Key.ToString(), x => x.Average(y => y.RelativeToPar));

                var progressionDataPoints = playerHoleAverages.Scan((state, item) => state + item.Value, 0.0).Skip(1).ToList();

                playersStats.Add(new PlayerCourseStats
                {
                    PlayerName = player,
                    CourseName = courseName,
                    LayoutName = layoutName,
                    CourseAverage = currentCourseAverage,
                    PlayerCourseRecord = playerCourseRecord,
                    ThisRoundVsAverage = thisRound - currentCourseAverage,
                    HoleAverages = playerHoleAverages.Select(x => x.Value).ToList(),
                    AveragePrediction = progressionDataPoints,
                    RoundsPlayed = playerRounds.Count
                });
            }

            return playersStats.OrderBy(s => s.ThisRoundVsAverage).ToList();
        }
    }
}