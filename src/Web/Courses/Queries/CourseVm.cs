using AutoMapper;
using Web.Common.Mapping;
using System;
using System.Collections.Generic;

namespace Web.Courses.Queries
{
    public class CourseVm : IMapFrom<Course>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }

        public string Layout { get; set; }

        public List<CourseHoleVm> Holes { get; set; }
        public List<string> Admins { get; set; }

        public CourseStats CourseStats { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Course, CourseVm>().ForMember(d => d.CourseStats, opt => opt.Ignore());
        }

    }
}