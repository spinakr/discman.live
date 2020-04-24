using System;
using System.Collections.Generic;
using System.Linq;
using Baseline;
using Web.Courses;

namespace Web.Matches
{
    public class Round
    {
        public Round()
        {
        }

        public Guid Id { get; set; }
        public string CourseName { get; set; }
        public DateTime StartTime { get; set; }
        public List<string> Players { get; set; }
        public List<HoleScore> Scores { get; set; }

        public Round(Course course, List<string> players)
        {
            Id = Guid.NewGuid();
            CourseName = course.Name;
            StartTime = DateTime.Now;
            Players = players;
            Scores = GenerateEmptyScoreCard(course.Holes, players);
        }

        private static List<HoleScore> GenerateEmptyScoreCard(List<Hole> courseHoles, List<string> players)
        {
            return courseHoles
                .Select(h => new HoleScore
                {
                    Hole = h,
                    Scores = players.Select(p => new Score {Player = p}).ToList()
                }).ToList();
        }
    }

    public class HoleScore
    {
        public Hole Hole { get; set; }
        public List<Score> Scores { get; set; }
    }

    public class Score
    {
        public string Player { get; set; }
        public int Strokes { get; set; }
        public int RelativeToPar { get; set; }
    }
}