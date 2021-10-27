using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Web.Users
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
            Thread.Sleep(2000);
            using var documentSession = _documentStore.OpenSession();
            
            var users = documentSession.Query<User>().ToList();
            _logger.LogInformation("Removing self from friends");
            foreach (var user in users)
            {
                // user.LastEmailSent = null;
                user.Friends = user.Friends.Where(f => f != user.Username).ToList();
                documentSession.Update(user);
            }

            documentSession.SaveChanges();

            // _logger.LogInformation("Cleaning old users");
            //
            // var users = documentSession.Query<User>().ToList();
            // var deletedUser = 0;
            // foreach (var user in users)
            // {
            //     var rounds = documentSession
            //         .Query<Round>()
            //         .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
            //         .ToList();
            //
            //     if (rounds.Count == 0)
            //     {
            //         // documentSession.Delete(user);
            //         _logger.LogInformation($"Deleting user {user.Username}, no rounds registered and more than 5 months old");
            //         deletedUser++;
            //     }
            //
            // }
            // _logger.LogInformation($"Deleted {deletedUser} users!");

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