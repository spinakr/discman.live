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
        private readonly IMediator _mediator;

        public EvaluateAchievementsOnCompetedRound(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub, IMediator mediator)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
            _mediator = mediator;
        }

        public async Task Handle(RoundWasCompleted notification, CancellationToken cancellationToken)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId, token: cancellationToken);

            var newUserAchievements = await EvaluateAchievements(round);
            if (round.Achievements is null) round.Achievements = new List<Achievement>();
            round.Achievements.AddRange(newUserAchievements);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersOnUpdatedRound("", round);
        }

        private async Task<IEnumerable<Achievement>> EvaluateAchievements(Round round)
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

                var userRounds = rounds.Concat(new List<Round> {round}).ToList();

                var userAchievements = userInRound.Achievements.EvaluateUserRounds(userRounds, userInRound.Username);

                var newAchievements = roundAchievements.Concat(userAchievements).ToList();

                if (!newAchievements.Any()) continue;
                _documentSession.Update(userInRound);
                newUserAchievements.AddRange(newAchievements);
            }

            foreach (var achievement in newUserAchievements)
            {
                await _mediator.Publish(new UserEarnedAchievement
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