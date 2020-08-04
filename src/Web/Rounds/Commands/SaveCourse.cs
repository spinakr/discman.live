using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Courses;
using Web.Infrastructure;
using Web.Rounds;

namespace Web.Rounds.Commands
{
    public class SaveCourseCommand : IRequest<Course>
    {
        public Guid RoundId { get; set; }
        public string CourseName { get; set; }
    }

    public class SaveCourseCommandHandler : IRequestHandler<SaveCourseCommand, Course>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<RoundsHub> _roundsHub;

        public SaveCourseCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IHubContext<RoundsHub> roundsHub)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _roundsHub = roundsHub;
        }

        public async Task<Course> Handle(SaveCourseCommand request, CancellationToken cancellationToken)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            
            var round = await _documentSession.Query<Round>().SingleAsync(x => x.Id == request.RoundId, token: cancellationToken);
            round.CourseName = request.CourseName;

            if (!round.IsPartOfRound(username)) throw new UnauthorizedAccessException($"Cannot update round you are not part of");

            var holes = round
                .PlayerScores
                .First().Scores
                .Select(x => new Hole(x.Hole.Number, x.Hole.Par, x.Hole.Distance))
                .ToList();

            var newCourse = new Course(request.CourseName, holes);
            
            _documentSession.Store(newCourse);
            _documentSession.Update(round);
            await _documentSession.SaveChangesAsync(cancellationToken);
            await _roundsHub.NotifyPlayersInRound(round);

            return newCourse;
        }
    }
}