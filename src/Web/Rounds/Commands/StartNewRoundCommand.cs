using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Courses;
using Web.Rounds;
using Web.Rounds.Notifications;

namespace Web.Rounds.Commands
{
    public class StartNewRoundCommand : IRequest<Round>
    {
        public Guid CourseId { get; set; }
        public string RoundName { get; set; }
        public List<string> Players { get; set; }
        public ScoreMode ScoreMode { get; set; }
    }

    public class StartNewRoundCommandHandler : IRequestHandler<StartNewRoundCommand, Round>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMediator _mediator;

        public StartNewRoundCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IMediator mediator)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _mediator = mediator;
        }

        public async Task<Round> Handle(StartNewRoundCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var players = request.Players.Select(p => p.ToLower()).ToList();
            if (!players.Any()) players.Add(username);

            var course = _documentSession
                .Query<Course>()
                .SingleOrDefault(x => x.Id == request.CourseId);

            var justStartedRound = await _documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => !r.IsCompleted)
                .Where(r => r.PlayerScores.Any(s => s.PlayerName == username))
                .SingleOrDefaultAsync(r => r.StartTime > DateTime.Now.AddMinutes(-10), token: cancellationToken);

            if (justStartedRound is object) return justStartedRound;

            var round = course != null
                ? new Round(course, players, username, request.RoundName, request.ScoreMode)
                : new Round(players, username, request.RoundName, request.ScoreMode);
            _documentSession.Store(round);
            _documentSession.SaveChanges();

            await _mediator.Publish(new RoundWasStarted {RoundId = round.Id}, cancellationToken);

            return await Task.FromResult(round);
        }
    }
}