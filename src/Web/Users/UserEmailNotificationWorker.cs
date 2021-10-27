using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Baseline;
using Marten;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Serilog;
using Web.Rounds;

namespace Web.Users
{
    public class UserEmailNotificationWorker : IHostedService, IDisposable
    {
        private readonly ILogger<UserEmailNotificationWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private readonly ISendGridClient _sendGridClient;
        private Timer _timer;
        private readonly string[] _userToSendTo = {"kofoed", "torjus", "komtekpete", "cbg", "hettervik", "prodigykarlbebi", "glennhelgesen"};

        public UserEmailNotificationWorker(ILogger<UserEmailNotificationWorker> logger, IDocumentStore documentStore,
            ISendGridClient sendGridClient)
        {
            _logger = logger;
            _documentStore = documentStore;
            _sendGridClient = sendGridClient;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            if (DateTime.Now.DayOfWeek != DayOfWeek.Wednesday) return;
            Thread.Sleep(10000);
            using var documentSession = _documentStore.OpenSession();

            _logger.LogInformation("Sending notifications for passive users");

            var users = documentSession.Query<User>().ToList();
            var usersDict = new Dictionary<string, (User user, int roundCount, DateTime? lastRoundStarted)>();

            foreach (var user in users)
            {
                var rounds = documentSession
                    .Query<Round>()
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == user.Username))
                    .Where(r => !r.Deleted)
                    .Where(r => r.IsCompleted)
                    .Where(r => r.StartTime > DateTime.Today.AddMonths(-6))
                    .OrderByDescending(r => r.StartTime)
                    .ToList();

                var lastRound = rounds.FirstOrDefault();

                usersDict.Add(user.Username, (user, rounds.Count, lastRound?.StartTime));
            }

            var emailsToSend = new List<SendGridMessage>();
            foreach (var (_, (user, roundCount, lastRoundStarted)) in usersDict)
            {
                if (!ShouldCustomerBeNotified(user, roundCount, lastRoundStarted)) continue;

                var sinceLastRound = DateTime.Today - lastRoundStarted.Value.Date;

                var friendsByRounds = user.Friends
                    .OrderByDescending(f => usersDict.SingleOrDefault(u => u.Key == f).Value.roundCount)
                    .ToList();

                emailsToSend.Add(BuildEmail(roundCount, sinceLastRound, friendsByRounds, user));
                user.LastEmailSent = DateTime.Now;
                documentSession.Update(user);
            }

            documentSession.SaveChanges();

            foreach (var sendGridMessage in emailsToSend)
            {
                SendEmail(sendGridMessage);
            }
        }

        private bool ShouldCustomerBeNotified(User user, int roundCount, DateTime? lastRoundStarted)
        {
            if (!_userToSendTo.Contains(user.Username) ||
                user.Friends is null ||
                string.IsNullOrWhiteSpace(user.Email) ||
                user.LastEmailSent > DateTime.Now.AddDays(-14)) return false;
            if (roundCount < 5 || lastRoundStarted is null) return false;
            if (lastRoundStarted > DateTime.Today.AddDays(-14)) return false; //TODO: change to propper value (14)
            return true;
        }

        private void SendEmail(SendGridMessage emailMessage)
        {
            var response = _sendGridClient.SendEmailAsync(emailMessage).GetAwaiter().GetResult();
            if (!response.IsSuccessStatusCode) return;
            Log.Information("Sent reminder to {Email}, for user {Username}", 
                emailMessage.Personalizations.FirstOrDefault()?.Tos.FirstOrDefault()?.Email,
                emailMessage.Personalizations.FirstOrDefault()?.Tos.FirstOrDefault()?.Name);
        }

        private static SendGridMessage BuildEmail(int roundCount, TimeSpan sinceLastRound, List<string> friendsByRounds,
            User user)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("system@discman.live", "Discman Live"),
                Subject = "Discman.live inactivity warning"
            };
            msg.AddContent(MimeType.Text,
                @$"Hi {user.Username}!

You played {roundCount} rounds the last 6 months. It is now {sinceLastRound.Days} days since your last round, you should plan to play again soon.

{(friendsByRounds.Any() ? $"Ask you friends {friendsByRounds.Take(3).Join(", ")} to join a round this weekend!" : "")}


Regards
Discman.live
");

            msg.AddTo(new EmailAddress(user.Email, user.Username));
            return msg;
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