using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Marten.Linq;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Web.Users.Commands
{
    public class ChangeEmailCommand : IRequest<AuthenticatedUser>
    {
        public string NewEmail { get; set; }
    }
    
    public class ChangeEmailCommandHandler : IRequestHandler<ChangeEmailCommand, AuthenticatedUser>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _tokenSecret;

        public ChangeEmailCommandHandler(IDocumentSession documentSession, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _tokenSecret = configuration.GetValue<string>("TOKEN_SECRET");
        }
        
        public async Task<AuthenticatedUser> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername, token: cancellationToken);
            
            user.ChangeEmail(request.NewEmail);

            _documentSession.Update(user);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return user.Authenticated(_tokenSecret);
        }
    }
}