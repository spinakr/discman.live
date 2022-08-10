using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NServiceBus;
using Web.Rounds;
using Web.Users.Handlers;

namespace Web.Users
{
    public class DiscmanEloUpdater : IHostedService, IDisposable
    {
        private readonly ILogger<DiscmanEloUpdater> _logger;
        private readonly IDocumentStore _documentStore;
        private readonly IMessageSession _messageSession;
        private Timer _timer;

        public DiscmanEloUpdater(ILogger<DiscmanEloUpdater> logger, IDocumentStore documentStore,
            IMessageSession messageSession)
        {
            _logger = logger;
            _documentStore = documentStore;
            _messageSession = messageSession;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            Thread.Sleep(5000);
            using var documentSession = _documentStore.OpenSession();

            var users = documentSession.Query<User>().ToList();
            foreach (var user in users)
            {
                user.Elo = 1500.0;
                user.RatingHistory = new List<Rating>();
                documentSession.Update(user);
            }
            documentSession.SaveChanges();

            var rounds = documentSession.Query<Round>().OrderBy(r => r.StartTime).ToList();
            foreach (var round in rounds)
            {
                round.RatingChanges = new List<RatingChange>();
                documentSession.Update(round);
            }
            documentSession.SaveChanges();
            
            foreach (var round in rounds)
            {
                _messageSession.SendLocal<UpdateRatingsCommand>(e => { e.RoundId = round.Id; }).GetAwaiter()
                    .GetResult();
            }


            _logger.LogInformation("Sending UpdateRatingsCommands!!");
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