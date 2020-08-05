using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Matches;
using Web.Rounds;

namespace Web.Users.Queries
{
    public class GetUserFriendsQuery : IRequest<List<string>>
    {
    }
    
    public class GetUserFriendsQueryHandler: IRequestHandler<GetUserFriendsQuery, List<string>>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetUserFriendsQueryHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
        }
        
        public async Task<List<string>> Handle(GetUserFriendsQuery request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername, token: cancellationToken);
            return user.Friends;
        }
    }
}