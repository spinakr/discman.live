using System.Linq;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.SignalR;
using NServiceBus;
using Web.Feeds.Domain;
using Web.Infrastructure;
using Web.Rounds.NSBEvents;

namespace Web.Feeds.Handlers
{
    public class UpdateFeedsOnRoundDeleted : IHandleMessages<RoundWasDeleted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdateFeedsOnRoundDeleted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasDeleted notification, IMessageHandlerContext context)
        {
            var globalFeedItems = await _documentSession
                .Query<GlobalFeedItem>()
                .Where(x => x.RoundId == notification.RoundId)
                .ToListAsync();
            var globalItemIds = globalFeedItems.Select(item => item.Id).ToArray();
            var userFeedItems = await _documentSession
                .Query<UserFeedItem>()
                .Where(x => x.FeedItemId.IsOneOf(globalItemIds))
                .ToListAsync();

            foreach (var globalFeedItem in globalFeedItems)
            {
                _documentSession.Delete(globalFeedItem);
            }

            foreach (var userFeedItem in userFeedItems)
            {
                _documentSession.Delete(userFeedItem);
            }

            await _documentSession.SaveChangesAsync();
        }
    }
}