using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Marten;
using NServiceBus;
using Web.Feeds.Domain;
using Web.Tournaments.Notifications;
using Web.Users;
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Handlers
{
    public class UpdateFeedsOnUserJoinedTournament : IHandleMessages<PlayerJoinedTournament>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsOnUserJoinedTournament(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(PlayerJoinedTournament notification, IMessageHandlerContext context)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username);
            var friends = user.Friends ?? new List<string>();

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> { user.Username },
                ItemType = ItemType.Tournament,
                Action = Action.Joined,
                RegisteredAt = DateTime.Now,
                TournamentId = notification.TournamentId,
                TournamentName = notification.TournamentName
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);

            await _documentSession.SaveChangesAsync();
        }
    }
}