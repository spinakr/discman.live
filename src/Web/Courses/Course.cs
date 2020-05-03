using System;
using System.Collections.Generic;
using System.Linq;
using Marten.Linq;
using Web.Matches;

namespace Web.Courses
{
    public class Course
    {
        public Course()
        {
            
        }
        
        public Course(string courseName)
        {
            Id= Guid.NewGuid();
            Name = courseName;
            var holes = new List<Hole>();
            for (int i = 1; i < 19; i++)
            {
                holes.Add(new Hole(i, 3));
            }
            Holes = holes;
        }

        public Course(string courseName, List<int> holePars)
        {
            Id= Guid.NewGuid();
            Name = courseName;
            Holes = holePars.Select((h, i) => new Hole(i+1, h)).ToList();
        }

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