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
    public class SetScoreModeCommand : IRequest
    {
        public Guid RoundId { get; set; }
        public ScoreMode ScoreMode { get; set; }
    }

    public class SetScoreModeCommandHandler : IRequestHandler<SetScoreModeCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public SetScoreModeCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
        }

        public async Task<Unit> Handle(SetScoreModeCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == request.RoundId, token: cancellationToken);

            if (round.CreatedBy != username) throw new UnauthorizedAccessException($"Only the round owner can change score mode");
            
            round.ScoreMode = request.ScoreMode;

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersOnUpdatedRound(username, round);

            return new Unit();
        }
    }
}