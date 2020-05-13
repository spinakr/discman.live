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

        public Course(string courseName, List<int> holePars, List<int> holeDistances)
        {
            Id = Guid.NewGuid();
            Name = courseName;
            Holes = holePars.Select((h, i) => new Hole(i + 1, h, holeDistances[i])).ToList();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Hole> Holes { get; set; }

        public void UpdateHoles(List<int> holePars, List<int> holeDistances)
        {
            Holes = Holes.Select(h => new Hole(h.Number, holePars[h.Number - 1], holeDistances[h.Number - 1], h.Rating)).ToList();
        }
    }

    public class Hole
    {
        public Hole(int number, int par, int distance, int rating = 0)
        {
            Number = number;
            Par = par;
            Distance = distance;
            Rating = rating;
        }

        public int Number { get; set; }
        public int Par { get; set; }
        public int Distance { get; set; }
        public int Rating { get; set; }
    }
}