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
    public class UpdateFeedsOnScoreUpdated : INotificationHandler<ScoreWasUpdated>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnScoreUpdated(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(ScoreWasUpdated notification, CancellationToken cancellationToken)
        {
            if (notification.RelativeScore > -1) return;

            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username, token: cancellationToken);
            var friends = user.Friends ?? new List<string>();
            friends.Add(notification.Username);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> {user.Username},
                ItemType = ItemType.Hole,
                CourseName = notification.CourseName,
                HoleScore = notification.RelativeScore,
                HoleNumber = notification.HoleNumber,
                RegisteredAt = DateTime.Now,
                RoundId = notification.RoundId
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);
            
            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}