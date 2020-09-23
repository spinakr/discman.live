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
using Web.Rounds.Notifications;

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
        private readonly IMediator _mediator;

        public UpdatePlayerScoreCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub, IMediator mediator)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
            _mediator = mediator;
        }

        public async Task<Round> Handle(UpdatePlayerScoreCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(x => x.Id == request.RoundId, token: cancellationToken);

            if (!round.IsPartOfRound(authenticatedUsername)) throw new UnauthorizedAccessException($"Cannot update round you are not part of");
            if (request.Username != authenticatedUsername) throw new UnauthorizedAccessException($"You can only update scores for yourself");

            var holeScore = round.PlayerScores
                .Single(p => p.PlayerName == authenticatedUsername).Scores
                .Single(s => s.Hole.Number == request.Hole);

            var holeAlreadyRegistered = holeScore.Strokes != 0;
            
            var relativeScore = holeScore
                .UpdateScore(request.Strokes, request.StrokeOutcomes);

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersOnUpdatedRound(round);

            await _mediator.Publish(new ScoreWasUpdated
            {
                RoundId = round.Id,
                Username = authenticatedUsername,
                CourseName = round.CourseName,
                HoleNumber = request.Hole,
                RelativeScore = relativeScore,
                ScoreWasChanged = holeAlreadyRegistered
            }, cancellationToken);

            return round;
        }
    }
}