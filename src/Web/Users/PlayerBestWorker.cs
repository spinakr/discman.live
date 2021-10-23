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
    public class PlayerBestWorker : IHostedService, IDisposable
    {
        private readonly ILogger<PlayerBestWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public PlayerBestWorker(ILogger<PlayerBestWorker> logger, IDocumentStore documentStore)
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

            var users = documentSession.Query<User>().ToList();
            foreach (var user in users)
            {
                // var points = 0;
                var rounds = documentSession
                    .Query<Round>()
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
                    .Where(r => r.IsCompleted)
                    .Where(r => r.PlayerScores.Count > 1)
                    .ToList();



                // documentSession.Update(user);
            }

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