using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;
using Marten.Pagination;
using Web.Rounds;

namespace Web.Rounds.Queries
{
    public class GetUserRoundsQuery : IRequest<RoundsVm>
    {
        public string Username { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
    
    public class GetUserRoundsQueryHandler : IRequestHandler<GetUserRoundsQuery, RoundsVm>
    {
        private readonly IDocumentSession _documentSession;

        public GetUserRoundsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<RoundsVm> Handle(GetUserRoundsQuery request, CancellationToken cancellationToken)
        {
            var rounds = await _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.PlayerScores.Any(p => p.PlayerName == request.Username))
                .OrderByDescending(x => x.StartTime)
                .ToPagedListAsync(request.Page, request.PageSize, token: cancellationToken);
            
            return new RoundsVm
            {
                Rounds = rounds.ToList(),
                Pages = rounds.PageCount,
                PageNumber= rounds.PageNumber,
                TotalItemCount = rounds.TotalItemCount
            };
        }
    }
}