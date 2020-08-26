using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Marten;
using Marten.Linq.SoftDeletes;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Infrastructure;
using Web.Rounds;
using Web.Users;

namespace Web.Courses
{
    public class AchievementsWorker : IHostedService, IDisposable
    {
        private readonly ILogger<AchievementsWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public AchievementsWorker(ILogger<AchievementsWorker> logger, IDocumentStore documentStore)
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

            var featureToggles = documentSession.Query<FeatureToggles>().SingleOrDefault();
            if (featureToggles is null)
            {
                featureToggles = new FeatureToggles();
                documentSession.Store(featureToggles);
            }

            if (featureToggles.CleanAchievements2) return;
            featureToggles.CleanAchievements2 = true;
            documentSession.Update(featureToggles);
            _logger.LogInformation("Cleaning achievements 2");

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