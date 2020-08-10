using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Courses;
using Web.Tournaments.Domain;
using Web.Tournaments.Queries;

namespace Web.Tournaments.Commands
{
    public class AddPlayerToTournamentCommand : IRequest
    {
        public Guid TournamentId { get; set; }
    }

    public class AddPlayerToTournamentCommandHandler : IRequestHandler<AddPlayerToTournamentCommand>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _contextAccessor;

        public AddPlayerToTournamentCommandHandler(IDocumentSession documentSession, IHttpContextAccessor contextAccessor)
        {
            _documentSession = documentSession;
            _contextAccessor = contextAccessor;
        }

        public async Task<Unit> Handle(AddPlayerToTournamentCommand request, CancellationToken cancellationToken)
        {
            var username = _contextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var tournament = await _documentSession.Query<Tournament>().SingleAsync(t => t.Id == request.TournamentId, token: cancellationToken);
            tournament.AddPlayer(username);

            _documentSession.Update(tournament);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}