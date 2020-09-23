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

namespace Web.Rounds.Notifications
{
    public class NotifyPlayersOnRoundStarted : INotificationHandler<RoundWasStarted>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHubContext<RoundsHub> _roundsHub;
        private readonly IMediator _mediator;

        public NotifyPlayersOnRoundStarted(IDocumentSession documentSession, IHubContext<RoundsHub> roundsHub, IMediator mediator)
        {
            _documentSession = documentSession;
            _roundsHub = roundsHub;
            _mediator = mediator;
        }

        public async Task Handle(RoundWasStarted notification, CancellationToken cancellationToken)
        {
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == notification.RoundId, token: cancellationToken);
            await _roundsHub.NotifyPlayersOnNewRound(round);
        }
    }
}