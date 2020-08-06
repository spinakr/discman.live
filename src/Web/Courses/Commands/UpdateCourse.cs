using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Users;

namespace Web.Courses.Commands
{
    public class UpdateCourseCommand : IRequest<Course>
    {
        public Guid CourseId { get; set; }
        public List<int> HolePars { get; set; }
        public List<int> HoleDistances { get; set; }
    }

    public class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand, Course>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UpdateCourseCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Course> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var course = await _documentSession.Query<Course>().SingleAsync(c => c.Id == request.CourseId, token: cancellationToken);
            if (course.Admins is null || course.Admins.All(a => a != authenticatedUsername)) throw new UnauthorizedAccessException();
            course.UpdateHoles(request.HolePars, request.HoleDistances);

            _documentSession.Update(course);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return course;
        }
    }
}