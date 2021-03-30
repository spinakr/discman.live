using System;
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

            // if (featureToggles.CleanOldUsersDone) return;
            // featureToggles.CleanOldUsersDone = true;
            // documentSession.Update(featureToggles);
            // _logger.LogInformation("Cleaning old users");

            // var activeUsers = documentSession.Query<User>().Where(u => u.ModifiedSince(DateTime.Today.AddMonths(-5))).ToList();
            // var users = documentSession.Query<User>().ToList();
            // foreach (var user in users.Where(u => !activeUsers.Any(a => a.Username == u.Username)))
            // {
            //     var rounds = documentSession
            //         .Query<Round>()
            //         .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
            //         .ToList();

            //     if (rounds.Count == 0)
            //     {
            //         // documentSession.Delete(user);
            //         _logger.LogInformation($"Deleting user {user.Username}, no rounds registered and more than 5 months old");
            //     }
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