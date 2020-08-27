using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;
using System.Security.Claims;
using Marten.Util;
using Microsoft.AspNetCore.Http;
using Web.Rounds;

namespace Web.Courses.Queries
{
    public class GetCoursesQuery : IRequest<IReadOnlyList<Course>>
    {
        public string Filter { get; set; }
    }

    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, IReadOnlyList<Course>>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetCoursesQueryHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IReadOnlyList<Course>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Filter))
            {
                var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
                var rounds = await _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == authenticatedUsername))
                    .OrderByDescending(x => x.StartTime)
                    .Take(20)
                    .ToListAsync(token: cancellationToken);

                var userCourses = rounds.Select(r => r.CourseName).Distinct().ToArray();
                var courses = await _documentSession
                    .Query<Course>()
                    .Where(c => c.Name.IsOneOf(userCourses))
                    .OrderByDescending(c => c.CreatedAt)
                    .ThenByDescending(c => c.Name)
                    .ToListAsync(token: cancellationToken);
                return courses;
            }

            return await _documentSession
                .Query<Course>()
                .Where(c => c.Name.Contains(request.Filter, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(c => c.CreatedAt)
                .ThenByDescending(c => c.Name)
                .ToListAsync(token: cancellationToken);
        }
    }
}