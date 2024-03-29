using System;
using System.Collections.Generic;
using System.Linq;
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
    public class UpdateFeedsOnScoreUpdated : IHandleMessages<ScoreWasUpdated>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnScoreUpdated(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(ScoreWasUpdated notification, IMessageHandlerContext context)
        {
            await CleanupFeedsIfScoreWasChanged(notification);
            if (notification.RelativeScore > -1) return;

            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username);
            var friends = user.Friends ?? new List<string>();
            friends.Add(notification.Username);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> { user.Username },
                ItemType = ItemType.Hole,
                CourseName = notification.CourseName,
                HoleScore = notification.RelativeScore,
                HoleNumber = notification.HoleNumber,
                RegisteredAt = DateTime.Now,
                RoundId = notification.RoundId
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);

            await _documentSession.SaveChangesAsync();
        }

        private async Task CleanupFeedsIfScoreWasChanged(ScoreWasUpdated notification)
        {
            if (!notification.ScoreWasChanged) return;

            var globalItem = await _documentSession
                .Query<GlobalFeedItem>()
                .Where(i =>
                    i.RoundId == notification.RoundId &&
                    i.HoleNumber == notification.HoleNumber &&
                    i.Subjects.Any(s => s == notification.Username))
                .SingleOrDefaultAsync();

            if (globalItem is null) return;

            var userItems = await _documentSession
                .Query<UserFeedItem>()
                .Where(i => i.FeedItemId == globalItem.Id)
                .ToListAsync();

            foreach (var userItem in userItems)
            {
                _documentSession.Delete(userItem);
            }

            _documentSession.Delete(globalItem);
            await _documentSession.SaveChangesAsync();
        }
    }
}