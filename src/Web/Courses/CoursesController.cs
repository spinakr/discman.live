using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Web.Matches;

namespace Web.Courses
{
    [Authorize]
    [ApiController]
    [Route("api/courses")]
    public class CoursesController : ControllerBase
    {
        private readonly ILogger<CoursesController> _logger;
        private readonly IDocumentSession _documentSession;

        public CoursesController(ILogger<CoursesController> logger, IDocumentSession documentSession)
        {
            _logger = logger;
            _documentSession = documentSession;
        }

        [HttpGet]
        public IActionResult GetCourses()
        {
            var courses = _documentSession
                .Query<Course>()
                .Take(10)
                .ToList();

            return Ok(courses);
        }

        [HttpPost]
        public IActionResult CreateCourse(CourseRequest request)
        {
            if (request.HoleDistances is null || !request.HoleDistances.Any())
            {
                request.HoleDistances = new int[request.NumberOfHoles].ToList();
            }

            if (request.HolePars is null || !request.HolePars.Any())
            {
                request.HolePars = new int[request.NumberOfHoles].Populate(3).ToList();
            }

            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var newCourse = new Course(request.CourseName, authenticatedUsername, request.HolePars, request.HoleDistances);

            _documentSession.Store(newCourse);
            _documentSession.SaveChanges();

            return Ok(newCourse);
        }

        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(Guid courseId, [FromBody] CourseRequest request)
        {
            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var course = await _documentSession.Query<Course>().SingleAsync(c => c.Id == courseId);
            if (course.Admins.All(a => a != authenticatedUsername)) return Forbid();
            course.UpdateHoles(request.HolePars, request.HoleDistances);

            _documentSession.Update(course);
            await _documentSession.SaveChangesAsync();

            return Ok(course);
        }

    }


    public class CourseRequest
    {
        public string CourseName { get; set; }
        public List<int> HolePars { get; set; }
        public List<int> HoleDistances { get; set; }
        public int NumberOfHoles { get; set; }
        
    }
}