using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Web.Infrastructure;
using Web.Rounds.Notifications;
using Web.Users;

namespace Web.Rounds.Commands
{
    public class CompleteRoundCommand : IRequest
    {
        public Guid RoundId { get; set; }
        public string Base64Signature { get; set; }
    }

    public class CompleteRoundCommandHandler : IRequestHandler<CompleteRoundCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;
        private readonly IMediator _mediator;

        public CompleteRoundCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor,
            IHubContext<RoundsHub> roundsHub, IMediator mediator)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(CompleteRoundCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == request.RoundId, token: cancellationToken);
            if (!round.IsPartOfRound(authenticatedUsername)) throw new UnauthorizedAccessException("You can only complete rounds you are part of");
            if (round.IsCompleted) return new Unit();

            round.SignRound(authenticatedUsername, request.Base64Signature);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersOnUpdatedRound(authenticatedUsername, round);
            if (round.IsCompleted) await _mediator.Publish(new RoundWasCompleted { RoundId = round.Id }, cancellationToken);

            return new Unit();
        }
    }
}