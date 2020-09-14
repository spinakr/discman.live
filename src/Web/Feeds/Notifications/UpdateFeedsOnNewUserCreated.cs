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
    public class UpdateFeedsOnNewUserCreated : INotificationHandler<NewUserWasCreated>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsOnNewUserCreated(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(NewUserWasCreated notification, CancellationToken cancellationToken)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username, token: cancellationToken);

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> {user.Username},
                ItemType = ItemType.User,
                Action = Action.Created,
                RegisteredAt = DateTime.Now,
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(new List<string> {user.Username}, feedItem);

            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}