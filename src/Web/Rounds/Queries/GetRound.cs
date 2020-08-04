using System;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Web.Rounds;
using System.Linq;
using Web.Common;

namespace Web.Rounds.Queries
{
    public class GetRoundQuery : IRequest<Round>
    {
        public Guid RoundId { get; set; }
    }

    public class GetRoundsQueryHandler : IRequestHandler<GetRoundQuery, Round>
    {
        private readonly IDocumentSession _documentSession;

        public GetRoundsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<Round> Handle(GetRoundQuery request, CancellationToken cancellationToken)
        {
            var round =  _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .SingleOrDefault(x => x.Id == request.RoundId);
            
            if (round is null)
            {
                throw new NotFoundException(nameof(Round), request.RoundId);
            }

            return await Task.FromResult(round);
        }
    }
}