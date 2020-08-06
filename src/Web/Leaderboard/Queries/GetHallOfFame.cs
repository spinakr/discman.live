using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;

namespace Web.Leaderboard.Queries
{
    public class GetHallOfFameQuery : IRequest<HallOfFame>
    {
    }

    public class GetHallOfFameQueryHandler : IRequestHandler<GetHallOfFameQuery, HallOfFame>
    {
        private readonly IDocumentSession _documentSession;

        public GetHallOfFameQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task<HallOfFame> Handle(GetHallOfFameQuery request, CancellationToken cancellationToken)
        {
            return await _documentSession.Query<HallOfFame>().SingleAsync(token: cancellationToken);
        }
    }
}