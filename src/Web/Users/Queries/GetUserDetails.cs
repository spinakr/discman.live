using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Rounds;

namespace Web.Users.Queries
{
    public class GetUserDetailsQuery : IRequest<UserDetails>
    {
        public string Username { get; set; }
    }

    public class GetUserDetailsQueryHandler : IRequestHandler<GetUserDetailsQuery, UserDetails>
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
            var username = !string.IsNullOrWhiteSpace(request.Username) ? request.Username : authenticatedUsername;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == username, token: cancellationToken);
            var details = _mapper.Map<UserDetails>(user);


            var activeRound = await _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => !r.IsCompleted)
                .Where(r => r.PlayerScores.Any(s => s.PlayerName == username))
                .FirstOrDefaultAsync(token: cancellationToken);

            if (activeRound != null) details.ActiveRound = activeRound.Id;

            return details;
        }
    }
}