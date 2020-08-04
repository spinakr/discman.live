using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;
using Web.Rounds;

namespace Web.Rounds.Queries
{
    public class GetUserRoundsQuery : IRequest<List<Round>>
    {
        public string Username { get; set; }
        public int Start { get; set; }
        public int Count { get; set; }
    }
    
    public class GetUserRoundsQueryHandler : IRequestHandler<GetUserRoundsQuery, List<Round>>
    {
        private readonly IDocumentSession _documentSession;

        public GetUserRoundsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<List<Round>> Handle(GetUserRoundsQuery request, CancellationToken cancellationToken)
        {
            var rounds = _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.PlayerScores.Any(p => p.PlayerName == request.Username))
                .OrderByDescending(x => x.StartTime)
                .Skip(request.Start)
                .Take(request.Count)
                .ToList();
            
            return await Task.FromResult(rounds);
        }
    }
}