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
using Web.Rounds;

namespace Web.Rounds.Commands
{
    public class AddHoleCommand : IRequest<Round>
    {
        public Guid RoundId { get; set; }
        public int HoleNumber { get; set; }
        public int Par { get; set; }
        public int Length { get; set; }
    }

    public class AddHoleCommandHandler : IRequestHandler<AddHoleCommand, Round>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public AddHoleCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
        }

        public async Task<Round> Handle(AddHoleCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession.Query<Round>().SingleAsync(r => r.Id == request.RoundId, token: cancellationToken);

            if (!round.IsPartOfRound(username)) throw new UnauthorizedAccessException($"Cannot update round you are not part of");

            round.AddHole(request.HoleNumber, request.Par, request.Length);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);

            await _roundsHub.NotifyPlayersOnUpdatedRound(round);

            return round;
        }
    }
}