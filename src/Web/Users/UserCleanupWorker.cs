using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Marten.Linq.LastModified;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Infrastructure;
using Web.Rounds;
using Web.Users;

namespace Web.Courses
{
    public class UserCleanupWorker : IHostedService, IDisposable
    {
        private readonly ILogger<UserCleanupWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public UserCleanupWorker(ILogger<UserCleanupWorker> logger, IDocumentStore documentStore)
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
            // using var documentSession = _documentStore.OpenSession();

            // var featureToggles = documentSession.Query<FeatureToggles>().SingleOrDefault();
            // if (featureToggles is null)
            // {
            //     featureToggles = new FeatureToggles();
            //     documentSession.Store(featureToggles);
            // }

            // if (featureToggles.CleanOldUsersDone2) return;
            // featureToggles.CleanOldUsersDone2 = true;
            // documentSession.Update(featureToggles);
            // _logger.LogInformation("Cleaning old users");

            // var users = documentSession.Query<User>().ToList();
            // foreach (var user in users)
            // {
            // var rounds = documentSession
            //     .Query<Round>()
            //     .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
            //     .ToList();

            // if (rounds.Count == 0)
            // {
            //     // documentSession.Delete(user);
            //     _logger.LogInformation($"Deleting user {user.Username}, no rounds registered and more than 5 months old");
            // }
            //     if (user is null) continue;
            //     user.SimpleScoring = false;
            //     if (user.Achievements is null) user.Achievements = new Achievements();
            //     user.Achievements.RemoveAllofType("TwentyRoundsInAMonth");
            //     documentSession.Update(user);
            // }

            // var rounds = documentSession.Query<Round>().ToList();
            // foreach (var round in rounds)
            // {
            //     if (round.Achievements is null) continue;
            //     round.Achievements = round.Achievements.Where(a => a.AchievementName != "TwentyRoundsInAMonth").ToList();
            //     documentSession.Update(round);
            // }

            // documentSession.SaveChanges();
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