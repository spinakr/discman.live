using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Web.Rounds;
using Web.Users;

namespace Web.Rounds.Queries
{
    public class GetRoundStatsQuery : IRequest<List<UserStats>>
    {
        public Guid RoundId { get; set; }
    }

    public class GetRoundStatsQueryHandler : IRequestHandler<GetRoundStatsQuery, List<UserStats>>
    {
        private readonly IDocumentSession _documentSession;

        public GetRoundStatsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task<List<UserStats>> Handle(GetRoundStatsQuery request, CancellationToken cancellationToken)
        {
            var activeRound = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(r => r.Id == request.RoundId, token: cancellationToken);

            var usersStats = new List<UserStats>();
            var roundList = new List<Round> {activeRound};

            foreach (var playerScore in activeRound.PlayerScores)
            {
                var holes = roundList.PlayerHolesWithDetails(playerScore.PlayerName);
                usersStats.Add(new UserStats(
                    playerScore.PlayerName,
                    1, 
                    holes.Count, 
                    holes.Circle1Rate(), 
                    holes.Circle2Rate(), 
                    holes.FairwayRate(), 
                    holes.ScrambleRate(), 
                    0, 
                    0, 
                    holes.BirdieRate(), 
                    holes.ObRate(),
                    holes.ParRate()));
            }

            return usersStats;
        }
    }
}