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
    public class ChangePasswordCommand : IRequest
    {
        public string NewPassword { get; set; }
    }
    
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _tokenSecret;

        public ChangePasswordCommandHandler(IDocumentSession documentSession, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _tokenSecret = configuration.GetValue<string>("TOKEN_SECRET");
        }
        
        public async Task<Unit> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername, token: cancellationToken);
            
            var hashedPw = new SaltSeasonedHashedPassword(request.NewPassword);

            user.ChangePassword(hashedPw);

            _documentSession.Update(user);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}