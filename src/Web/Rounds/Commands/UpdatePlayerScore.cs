using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Infrastructure;
using Web.Rounds;

namespace Web.Rounds.Commands
{
    public class UpdatePlayerScoreCommand : IRequest<Round>
    {
        public Guid RoundId { get; set; }
        public int Hole { get; set; }
        public int Strokes { get; set; }
        public string Username { get; set; }

        public string[] StrokeOutcomes { get; set; }
    }

    public class UpdatePlayerScoreCommandHandler : IRequestHandler<UpdatePlayerScoreCommand, Round>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public UpdatePlayerScoreCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
        }

        public async Task<Round> Handle(UpdatePlayerScoreCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(x => x.Id == request.RoundId, token: cancellationToken);

            if (!round.IsPartOfRound(authenticatedUsername)) throw new UnauthorizedAccessException($"Cannot update round you are not part of");
            if (request.Username != authenticatedUsername) throw new UnauthorizedAccessException($"You can only update scores for yourself");

            round.PlayerScores
                .Single(p => p.PlayerName == authenticatedUsername).Scores
                .Single(s => s.Hole.Number == request.Hole)
                .UpdateScore(request.Strokes, request.StrokeOutcomes);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersInRound(round);

            return round;
        }
    }
}