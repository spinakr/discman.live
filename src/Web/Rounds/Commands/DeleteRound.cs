using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Marten.Linq.SoftDeletes;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Infrastructure;
using Web.Rounds;
using Web.Rounds.Notifications;

namespace Web.Rounds.Commands
{
    public class DeleteRoundCommand : IRequest
    {
        public Guid RoundId { get; set; }
    }

    public class DeleteRoundCommandHandler : IRequestHandler<DeleteRoundCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMediator _mediator;

        public DeleteRoundCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IMediator mediator)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(DeleteRoundCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == request.RoundId, token: cancellationToken);

            if (round.CreatedBy != username) throw new UnauthorizedAccessException("Only rounds created by yourself can be deleted");

            _documentSession.Delete(round);
            await _documentSession.SaveChangesAsync(cancellationToken);

            await _mediator.Publish(new RoundWasDeleted {RoundId = round.Id, Players = round.PlayerScores.Select(s => s.PlayerName).ToList()}, cancellationToken);

            return new Unit();
        }
    }
}