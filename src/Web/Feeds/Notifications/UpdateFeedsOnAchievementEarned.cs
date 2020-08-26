using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Baseline;
using Marten;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Web.Feeds.Domain;
using Web.Infrastructure;
using Web.Rounds;
using Web.Rounds.Notifications;
using Web.Users;

namespace Web.Feeds.Notifications
{
    public class UpdateFeedsOnAchievementEarned : INotificationHandler<UserEarnedAchievement>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnAchievementEarned(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(UserEarnedAchievement notification, CancellationToken cancellationToken)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username, token: cancellationToken);
            var friends = user.Friends ?? new List<string>();
            friends.Add(notification.Username);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> {user.Username},
                ItemType = ItemType.Achievement,
                RegisteredAt = notification.AchievedAt,
                RoundId = notification.RoundId,
                AchievementName = notification.AchievementName
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);
            
            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}