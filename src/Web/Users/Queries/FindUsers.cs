using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;

namespace Web.Users.Queries
{
    public class FindUsersQuery : IRequest<IReadOnlyList<string>>
    {
        public string UsernameSearchString { get; set; }
    }
    
    public class FindUserQueryHandler: IRequestHandler<FindUsersQuery, IReadOnlyList<string>>
    {
        private readonly IDocumentSession _documentSession;

        public FindUserQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<IReadOnlyList<string>> Handle(FindUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _documentSession
                .Query<User>()
                .Where(u => u.Username.Contains(request.UsernameSearchString.ToLower()))
                .Select(u => u.Username)
                .ToListAsync(token: cancellationToken);

            return users;
        }
    }
}