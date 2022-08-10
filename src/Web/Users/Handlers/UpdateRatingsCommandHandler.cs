using System;
using System.Linq;
using System.Threading.Tasks;
using Marten;
using Microsoft.Extensions.Logging;
using NServiceBus;
using Web.Rounds;
using Web.Rounds.NSBEvents;

namespace Web.Users.Handlers
{
    public class UpdateRatingsCommand : ICommand
    {
        public Guid RoundId { get; set; }
    }

    // ReSharper disable once UnusedType.Global
    public class UpdateRatingsCommandHandler : IHandleMessages<UpdateRatingsCommand>
    {
        private const double D = 400.0;
        private const double K = 32.0;
        private readonly IDocumentSession _documentSession;
        private readonly ILogger<UpdateRatingOnRoundCompleted> _logger;

        public UpdateRatingsCommandHandler(IDocumentSession documentSession,
            ILogger<UpdateRatingOnRoundCompleted> logger)
        {
            _documentSession = documentSession;
            _logger = logger;
        }

        public async Task Handle(UpdateRatingsCommand message, IMessageHandlerContext context)
        {
            _logger.LogInformation("Handling UpdateRatingsCommand");
            var round = await _documentSession.Query<Round>().FirstOrDefaultAsync(r => r.Id == message.RoundId);
            if (round is null) return;
            var roundPlayers = round.PlayerScores.Select(_ => _.PlayerName).ToArray();
            var players = _documentSession.Query<User>()
                .Where(u => u.Username.IsOneOf(roundPlayers))
                .ToDictionary(_ => _.Username, _ => _);
            if (players.Count < 2) return;

            var n = players.Count;

            foreach (var (username, player) in players)
            {
                var sumExpectedScoreParts = 0.0;
                foreach (var (_, opponent) in players.Where(p => p.Key != username))
                {
                    var expectedScorePart = CalculateExpectedScore(opponent.Elo, player.Elo);
                    sumExpectedScoreParts += expectedScorePart;
                }

                var playerExpectedScore = sumExpectedScoreParts / (n * (n - 1.0) / 2.0);
                _logger.LogInformation($"{player.Username} expected score {playerExpectedScore}");
                var playerScore = CalculatePlayerScoreLinear(round.PlayerStanding(username), n);
                _logger.LogInformation($"{player.Username} score {playerScore}");

                var newElo = player.Elo + K * (n - 1.0) * (playerScore - playerExpectedScore);
                round.RatingChanges.Add(new RatingChange {Change = newElo - player.Elo, Username = player.Username});
                player.RatingHistory.Add(new Rating {Elo = newElo, DateTime = round.CompletedAt});
                player.Elo = newElo;

                _documentSession.Update(player);
            }

            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync();
        }

        private double CalculatePlayerScoreLinear(int playerStanding, int n)
        {
            return (n - playerStanding) / (n * (n - 1.0) / 2.0);
        }

        private static double CalculateExpectedScore(double opponentElo, double playerElo)
        {
            return 1.0 / (1.0 + Math.Pow(10.0, (opponentElo - playerElo) / D));
        }
    }
}