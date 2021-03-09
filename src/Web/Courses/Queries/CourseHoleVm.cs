using AutoMapper;
using Web.Common.Mapping;

namespace Web.Courses.Queries
{
    public class CourseHoleVm : IMapFrom<Hole>
    {
        public int Number { get; set; }
        public int Par { get; set; }
        public int Distance { get; set; }
        public double Average { get; set; }
        public int Rating { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Hole, CourseHoleVm>();
        }

    }
}