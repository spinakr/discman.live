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
using Web.Tournaments.Notifications;
using Web.Users;
using Web.Users.Notifications;
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Notifications
{
    public class UpdateFeedsFriendsWasAdded : INotificationHandler<FriendWasAdded>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsFriendsWasAdded(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(FriendWasAdded notification, CancellationToken cancellationToken)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username, token: cancellationToken);
            var friend = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.FriendName, token: cancellationToken);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> {user.Username},
                ItemType = ItemType.Friend,
                Action = Action.Added,
                RegisteredAt = DateTime.Now,
                FriendName = friend.Username
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(new List<string>{user.Username, friend.Username}, feedItem);
            
            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}