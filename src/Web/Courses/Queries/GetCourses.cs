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
using AutoMapper;

namespace Web.Courses.Queries
{
    public class GetCoursesQuery : IRequest<IReadOnlyList<CourseVm>>
    {
        public string Filter { get; set; }
    }

    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, IReadOnlyList<CourseVm>>
    {
        private readonly IMapper _mapper;
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CourseStatsCache _courseStatsCache;

        public GetCoursesQueryHandler(IMapper mapper, IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, CourseStatsCache courseStatsCache)
        {
            _mapper = mapper;
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _courseStatsCache = courseStatsCache;
        }

        public async Task<IReadOnlyList<CourseVm>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            IReadOnlyList<Course> courses;
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
                courses = await _documentSession
                                    .Query<Course>()
                                    .Where(c => c.Name.IsOneOf(userCourses))
                                    .OrderByDescending(c => c.CreatedAt)
                                    .ThenByDescending(c => c.Name)
                                    .ToListAsync(token: cancellationToken);
            }
            else
            {
                courses = await _documentSession
                                .Query<Course>()
                                .Where(c => c.Name.Contains(request.Filter, StringComparison.OrdinalIgnoreCase))
                                .OrderByDescending(c => c.CreatedAt)
                                .ThenByDescending(c => c.Name)
                                .ToListAsync(token: cancellationToken);

            }
            var courseVms = courses
                .Select(c => _mapper.Map<CourseVm>(c))
                .Select(c =>
                {
                    c.CourseStats = _courseStatsCache.GetOrCreate(c.Id, () => GetCourseStats(c.Id));
                    return c;
                })
                .ToList();


            return courseVms.ToList();
        }

        private CourseStats GetCourseStats(Guid courseId)
        {
            if (courseId == default) return new CourseStats { RoundsOnCourse = 0 };
            var roundsCount = _documentSession
                .Query<Round>()
                .Count(r => r.CompletedAt > DateTime.Now.AddMonths(-3) && r.CourseId == courseId);
            var previousRound = _documentSession
                .Query<Round>()
                .Where(r => r.CompletedAt > DateTime.Now.AddMonths(-3) && r.CourseId == courseId)
                .OrderByDescending(r => r.CompletedAt)
                .FirstOrDefault();

            return new CourseStats { RoundsOnCourse = roundsCount, PreviousRound = previousRound?.CompletedAt };
        }
    }
}