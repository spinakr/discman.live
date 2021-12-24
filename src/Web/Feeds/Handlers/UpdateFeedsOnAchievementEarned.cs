using System.Collections.Generic;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.SignalR;
using NServiceBus;
using Web.Feeds.Domain;
using Web.Infrastructure;
using Web.Rounds.NSBEvents;
using Web.Users;

namespace Web.Feeds.Handlers
{
    public class UpdateFeedsOnAchievementEarned : IHandleMessages<UserEarnedAchievement>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnAchievementEarned(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(UserEarnedAchievement notification, IMessageHandlerContext context)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username);
            var friends = user.Friends ?? new List<string>();
            friends.Add(notification.Username);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> { user.Username },
                ItemType = ItemType.Achievement,
                RegisteredAt = notification.AchievedAt,
                RoundId = notification.RoundId,
                AchievementName = notification.AchievementName
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);

            await _documentSession.SaveChangesAsync();
        }
    }
}