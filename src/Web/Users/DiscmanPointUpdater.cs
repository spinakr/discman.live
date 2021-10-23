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
    public class DiscmanPointUpdater : IHostedService, IDisposable
    {
        private readonly ILogger<DiscmanPointUpdater> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public DiscmanPointUpdater(ILogger<DiscmanPointUpdater> logger, IDocumentStore documentStore)
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
                var points = 0;
                var rounds = documentSession
                    .Query<Round>()
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
                    .ToList();

                foreach (var round in rounds)
                {
                    points += 1;
                    var holes = round.PlayerScores
                        .Where(s => s.PlayerName == user.Username)
                        .SelectMany(s => s.Scores)
                        .ToList();

                    var birdies = holes.Count(h => h.RelativeToPar == -1);
                    var aces = holes.Count(h => h.Strokes == 1);

                    points += birdies;
                    points += aces * 10;
                }

                user.DiscmanPoints = points;
                documentSession.Update(user);
            }

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