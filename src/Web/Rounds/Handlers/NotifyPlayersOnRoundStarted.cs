using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.SignalR;
using Web.Infrastructure;
using NServiceBus;
using Web.Rounds.NSBEvents;

namespace Web.Rounds.Notifications
{
    public class NotifyPlayersOnRoundStarted : IHandleMessages<RoundWasStarted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public NotifyPlayersOnRoundStarted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
        }

        public async Task Handle(RoundWasStarted notification, IMessageHandlerContext context)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId);
            await _roundsHub.NotifyPlayersOnNewRound(round);
        }
    }
}