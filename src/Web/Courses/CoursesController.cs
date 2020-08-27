using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Courses.Commands;
using Web.Courses.Queries;

namespace Web.Courses
{
    [Authorize]
    [ApiController]
    [Route("api/courses")]
    public class CoursesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CoursesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses([FromQuery] string filter)
        {
            return Ok(await _mediator.Send(new GetCoursesQuery {Filter = filter}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse(CourseRequest request)
        {
            var newCourse = await _mediator.Send(new CreateNewCourseCommand
            {
                CourseName = request.CourseName,
                HoleDistances = request.HoleDistances,
                HolePars = request.HolePars,
                LayoutName = request.LayoutName,
                NumberOfHoles = request.NumberOfHoles
            });

            return Ok(newCourse);
        }

        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(Guid courseId, [FromBody] CourseRequest request)
        {
            var course = await _mediator.Send(new UpdateCourseCommand
            {
                CourseId = courseId,
                HoleDistances = request.HoleDistances,
                HolePars = request.HolePars,
            });

            return Ok(course);
        }
    }


    public class CourseRequest
    {
        public string LayoutName { get; set; }
        public string CourseName { get; set; }
        public List<int> HolePars { get; set; }
        public List<int> HoleDistances { get; set; }
        public int NumberOfHoles { get; set; }
    }
}