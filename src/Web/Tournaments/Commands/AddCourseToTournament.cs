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
    public class AddCourseToTournamentCommand : IRequest<CourseNameAndId>
    {
        public Guid TournamentId { get; set; }
        public Guid CourseId { get; set; }
    }

    public class AddCourseToTournamentCommandHandler : IRequestHandler<AddCourseToTournamentCommand, CourseNameAndId>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMapper _mapper;

        public AddCourseToTournamentCommandHandler(IDocumentSession documentSession, IHttpContextAccessor contextAccessor, IMapper mapper)
        {
            _documentSession = documentSession;
            _contextAccessor = contextAccessor;
            _mapper = mapper;
        }

        public async Task<CourseNameAndId> Handle(AddCourseToTournamentCommand request, CancellationToken cancellationToken)
        {
            var username = _contextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var tournament = await _documentSession.Query<Tournament>().SingleAsync(t => t.Id == request.TournamentId, token: cancellationToken);
            if (tournament.Admins.All(a => a != username)) throw new UnauthorizedAccessException("You must be an admin to change the tournament");
            tournament.AddCourse(request.CourseId);

            _documentSession.Update(tournament);
            await _documentSession.SaveChangesAsync(cancellationToken);
            var course = await _documentSession.Query<Course>().SingleAsync(c => c.Id == request.CourseId, token: cancellationToken);
            return new CourseNameAndId
            {
                Id = course.Id,
                Name = course.Name,
                Layout = course.Layout
            };
        }
    }
}