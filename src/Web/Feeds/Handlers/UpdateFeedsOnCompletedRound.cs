using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.SignalR;
using NServiceBus;
using Web.Feeds.Domain;
using Web.Infrastructure;
using Web.Rounds;
using Web.Rounds.NSBEvents;
using Web.Users;
using Action = Web.Feeds.Domain.Action;

namespace Web.Feeds.Handlers
{
    public class UpdateFeedsOnCompletedRound : IHandleMessages<RoundWasCompleted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnCompletedRound(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasCompleted notification, IMessageHandlerContext context)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId);

            var friends = new List<string>();
            var players = round.PlayerScores.Select(s => s.PlayerName).ToList();
            foreach (var player in players)
            {
                var user = await _documentSession.Query<User>().SingleAsync(x => x.Username == player);
                friends.AddRange(user.Friends ?? new List<string>());
            }

            friends = friends.Distinct().ToList();

            var feedItem = new GlobalFeedItem
            {
                Subjects = players,
                ItemType = ItemType.Round,
                Action = Action.Completed,
                RegisteredAt = DateTime.Now,
                CourseName = round.CourseName,
                RoundId = round.Id,
                RoundScores = players.Select(x => round.PlayerScore(x)).ToList()
            };

            _documentSession.Store(feedItem);

            _documentSession.UpdateFriendsFeeds(friends, feedItem);

            await _documentSession.SaveChangesAsync();
        }

    }
}