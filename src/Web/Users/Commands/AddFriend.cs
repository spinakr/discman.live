using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Users.NSBEvents;

namespace Web.Users.Commands
{
    public class AddFriendCommand : IRequest
    {
        public string Username { get; set; }
    }

    public class AddFriendCommandHandler : IRequestHandler<AddFriendCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMediator _mediator;

        public AddFriendCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IMediator mediator)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(AddFriendCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername, token: cancellationToken);
            var friend = await _documentSession.Query<User>().SingleAsync(u => u.Username == request.Username.ToLower(), token: cancellationToken);

            user.AddFriend(friend.Username);
            friend.AddFriend(user.Username);

            _documentSession.Update(user);
            _documentSession.Update(friend);
            await _documentSession.SaveChangesAsync(cancellationToken);

            await _mediator.Publish(new FriendWasAdded
            {
                Username = user.Username,
                FriendName = friend.Username
            }, cancellationToken);

            return new Unit();
        }
    }
}