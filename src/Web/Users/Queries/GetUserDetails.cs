using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Web.Users.Queries
{
    public class GetUserDetailsQuery : IRequest<UserDetails>
    {
    }

    public class GetUserDetailsQueryHandler: IRequestHandler<GetUserDetailsQuery, UserDetails>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public GetUserDetailsQueryHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }
        
        public async Task<UserDetails> Handle(GetUserDetailsQuery request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername, token: cancellationToken);
            return _mapper.Map<UserDetails>(user);
        }
    }
}