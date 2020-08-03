using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Baseline;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Leaderboard;
using Web.Matches;
using Web.Rounds;
using Web.Rounds.Domain;

namespace Web.Courses
{
    public class LeaderboardWorker : IHostedService, IDisposable
    {
        private readonly ILogger<LeaderboardWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public LeaderboardWorker(ILogger<LeaderboardWorker> logger, IDocumentStore documentStore)
        {
            _logger = logger;
            _documentStore = documentStore;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var documentSession = _documentStore.OpenSession();
            var hallOfFame = documentSession
                .Query<HallOfFame>()
                .SingleOrDefault();

            if (hallOfFame is null)
            {
                hallOfFame = new HallOfFame();
                documentSession.Store(hallOfFame);
            }

            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            if (hallOfFame?.UpdatedAt.Month == month && hallOfFame.UpdatedAt.Year == year)
            {
                _logger.LogInformation($"HallOfFame already set for this month");
                return;
            }

            _logger.LogInformation($"Setting HallOfFame for month {month}");
            //Rounds for previous month
            var rounds = documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.IsCompleted)
                .ToList();

            var roundsPreviousMonth = rounds.Where(r => r.StartTime.Month == month - 1 && r.StartTime.Year == year).ToList();

            if (!roundsPreviousMonth.Any()) return;

            var playerStats = roundsPreviousMonth
                .CalculatePlayerStats()
                .OrderBy(x => x.AverageHoleScore)
                .ToList();
            if (!playerStats.Any()) return;


            var mostBirdies = playerStats.OrderByDescending(s => s.BirdieCount).First();
            var mostBogies = playerStats.OrderByDescending(s => s.BogeyCount).First();
            var mostRounds = playerStats.OrderByDescending(s => s.RoundCount).First();
            var bestRoundAverage = playerStats.OrderBy(s => s.AverageHoleScore).First();

            var monthHallOfFame = new MonthHallOfFame(mostBirdies, mostBogies, mostRounds, bestRoundAverage);

            hallOfFame.UpdateHallOfFame(monthHallOfFame);

            documentSession.Store(monthHallOfFame);
            documentSession.Update(hallOfFame);
            documentSession.SaveChanges();
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}