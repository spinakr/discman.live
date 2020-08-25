using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Feeds.Domain;
using Web.Rounds;
using Web.Tournaments.Commands;
using Web.Tournaments.Domain;

namespace Web.Leaderboard
{
    public class TournamentWorker : IHostedService, IDisposable
    {
        private readonly ILogger<TournamentWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private readonly IMediator _mediator;
        private Timer _timer;

        public TournamentWorker(ILogger<TournamentWorker> logger, IDocumentStore documentStore, IMediator mediator)
        {
            _logger = logger;
            _documentStore = documentStore;
            _mediator = mediator;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var documentSession = _documentStore.OpenSession();

            var tournaments = documentSession
                .Query<Tournament>()
                .Where(t => t.Prices == null)
                .ToList();

            foreach (var tournament in tournaments)
            {
                _logger.LogInformation("Calculating prices for tournament {TournamentId}", tournament.Id);
                _mediator.Send(new CalculatePricesCommand
                {
                    TournamentId = tournament.Id
                }).GetAwaiter().GetResult();
            }
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