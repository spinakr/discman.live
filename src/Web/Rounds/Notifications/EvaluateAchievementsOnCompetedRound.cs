using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using Web.Infrastructure;
using Web.Rounds;
using Web.Users;

namespace Web.Rounds.Notifications
{
    public class EvaluateAchievementsOnCompetedRound : INotificationHandler<RoundWasCompleted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public EvaluateAchievementsOnCompetedRound(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasCompleted notification, CancellationToken cancellationToken)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId, token: cancellationToken);
            
            var newUserAchievements = EvaluateAchievements(round);
            if (round.Achievements is null) round.Achievements = new List<Achievement>();
            round.Achievements.AddRange(newUserAchievements);
            
            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersInRound(round);
        }
        
        private IEnumerable<Achievement> EvaluateAchievements(Round round)
        {
            var userNames = round.PlayerScores.Select(s => s.PlayerName).ToArray();

            var users = _documentSession
                .Query<User>()
                .Where(u => u.Username.IsOneOf(userNames));


            var newUserAchievements = new List<Achievement>();
            foreach (var userInRound in users)
            {
                if (userInRound.Achievements is null) userInRound.Achievements = new Achievements();
                var roundAchievements = userInRound.Achievements.EvaluatePlayerRound(round.Id, userInRound.Username, round);

                var now = DateTime.Now;
                var rounds = _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == userInRound.Username))
                    .Where(r => r.PlayerScores.Count > 1)
                    .Where(r => r.IsCompleted)
                    // .Where(r => r.CompletedAt > new DateTime(now.Year, 1, 1))
                    .ToList();

                var userRounds = rounds.Concat(new List<Round> {round}).ToList();

                var userAchievements = userInRound.Achievements.EvaluateUserRounds(userRounds, userInRound.Username);

                var newAchievements = roundAchievements.Concat(userAchievements).ToList();

                if (!newAchievements.Any()) continue;
                _documentSession.Update(userInRound);
                newUserAchievements.AddRange(newAchievements);
            }

            return newUserAchievements;
        }
    }
}