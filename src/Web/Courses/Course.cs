using System;
using System.Collections.Generic;
using System.Linq;
using Marten.Linq;
using Web.Matches;

namespace Web.Courses
{
    public class Course
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Hole> Holes { get; set; }
    }

    public class Hole
    {
        public Hole(int number, int par)
        {
            Number = number;
            Par = par;
        }
        public int Number { get; set; }
        public int Par { get; set; }
    }
}