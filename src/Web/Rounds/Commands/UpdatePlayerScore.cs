using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using NServiceBus;
using Web.Infrastructure;
using Web.Rounds.NSBEvents;

namespace Web.Rounds.Commands
{
    public class UpdatePlayerScoreCommand : IRequest<Round>
    {
        public Guid RoundId { get; set; }
        public int HoleIndex { get; set; }
        public int Strokes { get; set; }
        public string Username { get; set; }

        public string[] StrokeOutcomes { get; set; }
        public int? PutDistance { get; set; }
    }

    public class UpdatePlayerScoreCommandHandler : IRequestHandler<UpdatePlayerScoreCommand, Round>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;
        private readonly IMessageSession _messageSession;

        public UpdatePlayerScoreCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub, IMessageSession messageSession)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
            _messageSession = messageSession;
        }

        public async Task<Round> Handle(UpdatePlayerScoreCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(x => x.Id == request.RoundId, token: cancellationToken);

            if (!round.IsPartOfRound(authenticatedUsername)) throw new UnauthorizedAccessException($"Cannot update round you are not part of");
            if (request.Username != authenticatedUsername) throw new UnauthorizedAccessException($"You can only update scores for yourself");

            var holeScore = round.PlayerScores.Single(p => p.PlayerName == authenticatedUsername).Scores[request.HoleIndex];

            var holeAlreadyRegistered = holeScore.Strokes != 0;

            var relativeScore = holeScore.UpdateScore(request.Strokes, request.StrokeOutcomes, request.PutDistance);

            round.OrderByTeeHonours();

            if (round.PlayerScores.Sum(p => p.Scores.Count(s => s.Strokes != 0)) == 1)
            {
                foreach (var playerScore in round.PlayerScores)
                {
                    // var firstHoleIndex = playerScore.Scores.FindIndex(x => x.Hole.Number == request.Hole);
                    playerScore.Scores = playerScore.Scores
                        .Skip(request.HoleIndex)
                        .Concat(playerScore.Scores.Take(request.HoleIndex))
                        .ToList();
                }
            }

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersOnUpdatedRound(authenticatedUsername, round);

            await _messageSession.Publish(new ScoreWasUpdated
            {
                RoundId = round.Id,
                Username = authenticatedUsername,
                CourseName = round.CourseName,
                HoleNumber = holeScore.Hole.Number,
                RelativeScore = relativeScore,
                ScoreWasChanged = holeAlreadyRegistered
            });

            return round;
        }
    }
}