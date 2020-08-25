using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Web.Feeds.Domain;
using Web.Infrastructure;
using Web.Rounds;
using Web.Rounds.Notifications;
using Web.Users;
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Notifications
{
    public class UpdateFeedsOnRoundStarted : INotificationHandler<RoundWasStarted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnRoundStarted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasStarted notification, CancellationToken cancellationToken)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId, token: cancellationToken);

            var players = round.PlayerScores.Select(s => s.PlayerName).ToList();
            var friends = players.ToList();
            foreach (var player in players)
            {
                var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == player, token: cancellationToken);
                friends.AddRange(user.Friends ?? new List<string>());
            }

            friends = friends.Distinct().ToList();


            var feedItem = new GlobalFeedItem
            {
                Subjects = players,
                ItemType = ItemType.Round,
                Action = Action.Started,
                RegisteredAt = DateTime.Now,
                CourseName = round.CourseName,
                RoundId = round.Id
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);

            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}