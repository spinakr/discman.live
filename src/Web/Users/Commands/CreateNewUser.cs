using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Web.Users.Commands
{
    public class CreateNewUserCommand : IRequest<AuthenticatedUser>
    {
        private string _username;

        public string Username
        {
            get => _username.Trim().ToLower();
            set => _username = value;
        }

        public string Password { get; set; }
    }
    
    public class CreateNewUserCommandHandler : IRequestHandler<CreateNewUserCommand, AuthenticatedUser>
    {
        private readonly IDocumentSession _documentSession;
        private readonly string _tokenSecret;

        public CreateNewUserCommandHandler(IDocumentSession documentSession, IConfiguration configuration)
        {
            _documentSession = documentSession;
            _tokenSecret = configuration.GetValue<string>("TOKEN_SECRET");
        }
        
        public async Task<AuthenticatedUser> Handle(CreateNewUserCommand request, CancellationToken cancellationToken)
        {
            var hashedPw = new SaltSeasonedHashedPassword(request.Password);
            var newUser = new User(request.Username, hashedPw);

            _documentSession.Store(newUser);
            await _documentSession.SaveChangesAsync(cancellationToken);
            var authenticatedUser = newUser.Authenticated(_tokenSecret);
            return authenticatedUser;
        }
    }
}