using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Baseline;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Infrastructure;
using Web.Leaderboard;
using Web.Matches;
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
            if (featureToggles.ReEvaluateAchievementsDone) return;
            featureToggles.ReEvaluateAchievementsDone = true;
            documentSession.Update(featureToggles);
            _logger.LogInformation("Running re-evaluation of achievements!");
            
            var rounds = documentSession
                .Query<Round>()
                .ToList();

            foreach (var round in rounds)
            {
                EvaluateAchievements(documentSession, round);
            }

            var users = documentSession
                .Query<User>()
                .ToList();

            foreach (var user in users)
            {
                var userRounds = documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.IsCompleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
                    .ToList();

                if (user.Achievements is null) user.Achievements = new Achievements();
                var userAchievements = user.Achievements.EvaluateUserRounds(userRounds, user.Username);
                documentSession.Update(user);
            }
            
            
            documentSession.SaveChanges();
        }

        private IEnumerable<Achievement> EvaluateAchievements(IDocumentSession documentSession, Round round)
        {
            var userNames = round.PlayerScores.Select(s => s.PlayerName).ToArray();

            var users = documentSession
                .Query<User>()
                .Where(u => u.Username.IsOneOf(userNames));

            var newUserAchievements = new  List<Achievement>();
            foreach (var userInRound in users)
            {
                if (userInRound.Achievements is null) userInRound.Achievements = new Achievements();
                var newAchievements = userInRound.Achievements.EvaluatePlayerRound(round.Id, userInRound.Username, round);
                if (!newAchievements.Any()) continue;
                documentSession.Update(userInRound);
                newUserAchievements.AddRange(newAchievements);
            }
            
            return newUserAchievements;
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