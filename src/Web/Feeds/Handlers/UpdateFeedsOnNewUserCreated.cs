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
    public class UpdateFeedsOnNewUserCreated : IHandleMessages<NewUserWasCreated>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsOnNewUserCreated(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(NewUserWasCreated notification, IMessageHandlerContext context)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> { user.Username },
                ItemType = ItemType.User,
                Action = Action.Created,
                RegisteredAt = DateTime.Now,
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(new List<string> { user.Username }, feedItem);

            await _documentSession.SaveChangesAsync();
        }
    }
}