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
    public class CreateNewCourseCommand : IRequest<Course>
    {
        public string LayoutName { get; set; }
        public string CourseName { get; set; }
        public List<int> HolePars { get; set; }
        public List<int> HoleDistances { get; set; }
        public int NumberOfHoles { get; set; }
    }

    public class CreateNewCourseCommandHandler : IRequestHandler<CreateNewCourseCommand, Course>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CreateNewCourseCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Course> Handle(CreateNewCourseCommand request, CancellationToken cancellationToken)
        {
            if (request.HoleDistances is null || !request.HoleDistances.Any())
            {
                request.HoleDistances = new int[request.NumberOfHoles].ToList();
            }

            if (request.HolePars is null || !request.HolePars.Any())
            {
                request.HolePars = new int[request.NumberOfHoles].Populate(3).ToList();
            }

            var existingLayouts = await _documentSession.Query<Course>().Where(c => c.Name == request.CourseName).ToListAsync();
            if (existingLayouts.Any(l => l.Layout == request.LayoutName))
            {
                throw new ArgumentException($"Layout on course {request.CourseName} with name {request.LayoutName} already exist");
            }
            var layoutsWithoutName = existingLayouts.Where(l => string.IsNullOrWhiteSpace(l.Layout));
            foreach (var layoutWithoutName in layoutsWithoutName)
            {
                layoutWithoutName.Layout = $"Main{layoutWithoutName.CreatedAt.Year}";
                _documentSession.Update(layoutWithoutName);
            }

            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var newCourse = new Course(request.CourseName, request.LayoutName, authenticatedUsername, request.HolePars, request.HoleDistances);

            _documentSession.Store(newCourse);
            await _documentSession.SaveChangesAsync(cancellationToken);
            return newCourse;
        }
    }
}