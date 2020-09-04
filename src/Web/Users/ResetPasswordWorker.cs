using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Web.Users.Domain;

namespace Web.Users
{
    public class ResetPasswordWorker : IHostedService, IDisposable
    {
        private readonly ILogger<ResetPasswordWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public ResetPasswordWorker(ILogger<ResetPasswordWorker> logger, IDocumentStore documentStore)
        {
            _logger = logger;
            _documentStore = documentStore;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var documentSession = _documentStore.OpenSession();

            var expiredRequests = documentSession
                .Query<ResetPasswordRequest>()
                .Where(r => r.CreatedAt.AddHours(2) < DateTime.Now)
                .ToList();

            foreach (var expiredRequest in expiredRequests)
            {
                documentSession.Delete(expiredRequest);
                Log.Information($"Deleting expired reset password request for email {expiredRequest.Email} {expiredRequest.Id}");
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