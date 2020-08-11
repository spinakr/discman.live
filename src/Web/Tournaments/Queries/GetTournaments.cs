using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using Marten.Linq;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Rounds;
using Web.Tournaments.Domain;

namespace Web.Tournaments.Queries
{
    public class GetTournamentsCommand : IRequest<IEnumerable<TournamentListing>>
    {
        public Guid TournamentId { get; set; }
        public bool OnlyActive { get; set; }
    }

    public class GetTournamentsCommandHandler : IRequestHandler<GetTournamentsCommand, IEnumerable<TournamentListing>>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IMapper _mapper;
        private readonly TournamentCache _tournamentCache;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetTournamentsCommandHandler(IDocumentSession documentSession, IMapper mapper, TournamentCache tournamentCache,
            IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _mapper = mapper;
            _tournamentCache = tournamentCache;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<TournamentListing>> Handle(GetTournamentsCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var tournaments = await _documentSession
                .Query<Tournament>()
                .Where(t => t.Players.Any(p => p == username))
                .Where(t => !request.OnlyActive || t.End >= DateTime.Now.Date)
                .ToListAsync(token: cancellationToken);
            
            return tournaments.Select(t => _mapper.Map<TournamentListing>(t)).OrderByDescending(s => s.Start);
        }
    }
}