using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Marten;
using NServiceBus;
using Web.Feeds.Domain;
using Web.Users;
using Web.Users.Notifications;
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Handlers
{
    public class UpdateFeedsFriendsWasAdded : IHandleMessages<FriendWasAdded>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsFriendsWasAdded(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(FriendWasAdded notification, IMessageHandlerContext context)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username);
            var friend = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.FriendName);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> { user.Username },
                ItemType = ItemType.Friend,
                Action = Action.Added,
                RegisteredAt = DateTime.Now,
                FriendName = friend.Username
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(new List<string> { user.Username, friend.Username }, feedItem);

            await _documentSession.SaveChangesAsync();
        }
    }
}