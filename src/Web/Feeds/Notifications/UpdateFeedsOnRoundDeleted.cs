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
    public class UpdateFeedsOnRoundDeleted : INotificationHandler<RoundWasDeleted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnRoundDeleted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasDeleted notification, CancellationToken cancellationToken)
        {
            var globalFeedItems = await _documentSession
                .Query<GlobalFeedItem>()
                .Where(x => x.RoundId == notification.RoundId)
                .ToListAsync(token: cancellationToken);
            var globalItemIds = globalFeedItems.Select(item => item.Id).ToArray();
            var userFeedItems = await _documentSession
                .Query<UserFeedItem>()
                .Where(x => x.FeedItemId.IsOneOf(globalItemIds))
                .ToListAsync(token: cancellationToken);

            foreach (var globalFeedItem in globalFeedItems)
            {
                _documentSession.Delete(globalFeedItem);
            }

            foreach (var userFeedItem in userFeedItems)
            {
                _documentSession.Delete(userFeedItem);
            }

            await _documentSession.SaveChangesAsync(cancellationToken);
        }
    }
}