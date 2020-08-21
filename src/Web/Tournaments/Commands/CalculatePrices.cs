using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Baseline;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Courses;
using Web.Rounds;
using Web.Tournaments.Domain;
using Web.Tournaments.Queries;

namespace Web.Tournaments.Commands
{
    public class CalculatePricesCommand : IRequest<TournamentPricesVm>
    {
        public Guid TournamentId { get; set; }
    }

    public class CalculatePricesCommandHandler : IRequestHandler<CalculatePricesCommand, TournamentPricesVm>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMapper _mapper;

        public CalculatePricesCommandHandler(IDocumentSession documentSession, IHttpContextAccessor contextAccessor, IMapper mapper)
        {
            _documentSession = documentSession;
            _contextAccessor = contextAccessor;
            _mapper = mapper;
        }

        public async Task<TournamentPricesVm> Handle(CalculatePricesCommand request, CancellationToken cancellationToken)
        {
            var tournament = await _documentSession.Query<Tournament>().SingleAsync(t => t.Id == request.TournamentId, token: cancellationToken);

            tournament.Prices = await CalculatePrices(tournament);

            _documentSession.Update(tournament);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return _mapper.Map<TournamentPricesVm>(tournament.Prices);
        }

        private async Task<TournamentPrices> CalculatePrices(Tournament tournament)
        {
            var prices = new TournamentPrices();

            foreach (var tournamentPlayer in tournament.Players)
            {
                var rounds = await _documentSession.GetTournamentRounds(tournamentPlayer, tournament);
                var totalScore = rounds.Sum(r => r.PlayerScore(tournamentPlayer));
                var playerScores = rounds.SelectMany(r => r.PlayerScores.Where(s => s.PlayerName == tournamentPlayer)).ToList();
                if (playerScores.Any() && playerScores.All(s => s.Scores.All(x => x.StrokeSpecs.Count > 0 || x.Strokes == 1)))
                {
                    var averagePutsPerHole = playerScores
                        .Average(s => s.Scores
                            .Average(h => h.StrokeSpecs
                                .Count(ss => ss.Outcome == StrokeSpec.StrokeOutcome.Circle1 || ss.Outcome == StrokeSpec.StrokeOutcome.Circle2)));

                    var fairwayHitRatio = playerScores.Sum(s => s.Scores.Count(h =>
                    {
                        var firstThrow = h.StrokeSpecs.FirstOrDefault()?.Outcome;

                        return firstThrow == StrokeSpec.StrokeOutcome.Fairway ||
                               firstThrow == StrokeSpec.StrokeOutcome.Circle1 ||
                               firstThrow == StrokeSpec.StrokeOutcome.Circle2;
                    })) / (double) playerScores.Sum(s => s.Scores.Count);

                    var averageMinsPerHole = playerScores.Average(s =>
                    {
                        var diffs = new List<TimeSpan>();
                        for (int i = 1; i < s.Scores.Count; i++)
                        {
                            var registeredAt = s.Scores[i].RegisteredAt;
                            var prev = s.Scores[i - 1].RegisteredAt;
                            diffs.Add(registeredAt - prev);
                        }

                        return diffs.Average(x => x.TotalMinutes);
                    });


                    if (string.IsNullOrWhiteSpace(prices.BestPutter?.ScoreValue) || double.Parse(prices.BestPutter.ScoreValue) > averagePutsPerHole)
                    {
                        prices.BestPutter = new TournamentPrice
                        {
                            ScoreValue = averagePutsPerHole.ToString(),
                            Username = tournamentPlayer
                        };
                    }

                    if (string.IsNullOrWhiteSpace(prices.MostAccurateDriver?.ScoreValue) ||
                        double.Parse(prices.MostAccurateDriver.ScoreValue) < fairwayHitRatio)
                    {
                        prices.MostAccurateDriver = new TournamentPrice
                        {
                            Username = tournamentPlayer,
                            ScoreValue = fairwayHitRatio.ToString()
                        };
                    }

                    if (string.IsNullOrWhiteSpace(prices.FastestPlayer?.ScoreValue) ||
                        double.Parse(prices.FastestPlayer.ScoreValue) > averageMinsPerHole)
                    {
                        prices.FastestPlayer = new TournamentPrice
                        {
                            Username = tournamentPlayer,
                            ScoreValue = averageMinsPerHole.ToString(CultureInfo.InvariantCulture)
                        };
                    }

                    if (string.IsNullOrWhiteSpace(prices.SlowestPlayer?.ScoreValue) ||
                        double.Parse(prices.SlowestPlayer.ScoreValue) < averageMinsPerHole)
                    {
                        prices.SlowestPlayer = new TournamentPrice
                        {
                            Username = tournamentPlayer,
                            ScoreValue = averageMinsPerHole.ToString(CultureInfo.InvariantCulture)
                        };
                    }
                }

                prices.Scoreboard.Add(new FinalScore {Score = totalScore, Username = tournamentPlayer, RoundsPlayed = playerScores.Count});
            }

            OrderScoreboard(prices);

            return prices;
        }

        private static void OrderScoreboard(TournamentPrices prices)
        {
            prices.Scoreboard = prices.Scoreboard.OrderBy(s => s.Score).ToList();
            var withoutRounds = prices.Scoreboard.Where(s => s.RoundsPlayed == 0).ToList();
            prices.Scoreboard = prices.Scoreboard.Except(withoutRounds).ToList();
            prices.Scoreboard.AddRange(withoutRounds);
        }
    }
}