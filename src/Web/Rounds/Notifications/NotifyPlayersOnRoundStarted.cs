using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using Web.Infrastructure;
using Web.Rounds;
using Web.Users;
using NServiceBus;

namespace Web.Rounds.Notifications
{
    public class NotifyPlayersOnRoundStarted : INotificationHandler<RoundWasStarted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;
        private readonly IMediator _mediator;
        private readonly IMessageSession _messageSession;

        public NotifyPlayersOnRoundStarted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub, IMediator mediator, IMessageSession messageSession)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
            _mediator = mediator;
            _messageSession = messageSession;
        }

        public async Task Handle(RoundWasStarted notification, CancellationToken cancellationToken)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId, token: cancellationToken);
            await _roundsHub.NotifyPlayersOnNewRound(round);
            await _messageSession.Publish<NSBEvents.RoundWasStarted>(e => { e.RoundId = round.Id; });
        }
    }
}