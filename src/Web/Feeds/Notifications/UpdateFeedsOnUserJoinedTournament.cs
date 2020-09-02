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
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Notifications
{
    public class UpdateFeedsOnUserJoinedTournament : INotificationHandler<PlayerJoinedTournament>
    {
        private readonly IDocumentSession _documentSession;

        public UpdateFeedsOnUserJoinedTournament(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task Handle(PlayerJoinedTournament notification, CancellationToken cancellationToken)
        {
            var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == notification.Username, token: cancellationToken);
            var friends = user.Friends ?? new List<string>();

            var feedItem = new GlobalFeedItem
            {
                Subjects = new List<string> {user.Username},
                ItemType = ItemType.Tournament,
                Action = Action.Joined,
                RegisteredAt = DateTime.Now,
                TournamentId = notification.TournamentId,
                TournamentName = notification.TournamentName
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);
            
            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}