using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Marten;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using Web.Infrastructure;
using Web.Users;
using NServiceBus;
using Web.Rounds.NSBEvents;

namespace Web.Rounds.Notifications
{
    public class EvaluateAchievementsOnCompetedRound : IHandleMessages<RoundWasCompleted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public EvaluateAchievementsOnCompetedRound(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasCompleted notification, IMessageHandlerContext context)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId);

            var newUserAchievements = await EvaluateAchievements(round, context);
            if (round.Achievements is null) round.Achievements = new List<Achievement>();
            round.Achievements.AddRange(newUserAchievements);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync();
            await _roundsHub.NotifyPlayersOnUpdatedRound("", round);
        }

        private async Task<IEnumerable<Achievement>> EvaluateAchievements(Round round, IMessageHandlerContext context)
        {
            var userNames = round.PlayerScores.Select(s => s.PlayerName).ToArray();

            var users = await _documentSession
                .Query<User>()
                .Where(u => u.Username.IsOneOf(userNames))
                .ToListAsync();


            var newUserAchievements = new List<Achievement>();
            foreach (var userInRound in users)
            {
                if (userInRound.Achievements is null) userInRound.Achievements = new Achievements();
                var roundAchievements = userInRound.Achievements.EvaluatePlayerRound(round.Id, userInRound.Username, round);

                var now = DateTime.Now;
                var rounds = await _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == userInRound.Username))
                    .Where(r => r.PlayerScores.Count > 1)
                    .Where(r => r.IsCompleted)
                    // .Where(r => r.CompletedAt > new DateTime(now.Year, 1, 1))
                    .ToListAsync();

                var userRounds = rounds.Concat(new List<Round> { round }).ToList();

                var userAchievements = userInRound.Achievements.EvaluateUserRounds(userRounds, userInRound.Username);

                var newAchievements = roundAchievements.Concat(userAchievements).ToList();

                if (!newAchievements.Any()) continue;
                _documentSession.Update(userInRound);
                newUserAchievements.AddRange(newAchievements);
            }

            foreach (var achievement in newUserAchievements)
            {
                await context.Publish(new UserEarnedAchievement
                {
                    RoundId = achievement.RoundId,
                    Username = achievement.Username,
                    AchievementName = achievement.AchievementName,
                    AchievedAt = achievement.AchievedAt
                }
                );
            }

            return newUserAchievements;
        }
    }
}