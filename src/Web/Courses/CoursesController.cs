using System;
using System.Collections.Generic;
using System.Linq;
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
            var newCourse = new Course(request.CourseName, request.HolePars, request.HoleDistances);

            _documentSession.Store(newCourse);
            _documentSession.SaveChanges();
                
            return Ok(newCourse);
        }
        
        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(Guid courseId, [FromBody]CourseRequest request)
        {
            var course = await _documentSession.Query<Course>().SingleAsync(c => c.Id == courseId);
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
    }
}