using System;
using System.Collections.Generic;
using System.Linq;
using Web.Courses;

namespace Web.Rounds
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
        
        public bool IsCompleted { get; set; }
        public List<HoleScore> Scores { get; set; }

        public bool IsActive
        {
            get { return Scores.Any(s => s.Scores.Any(s => s.Strokes == default)); }
        }

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
        public void UpdateScore(string username, int strokes, string[] strokeOutcomes)
        {
            var score = Scores.Single(s => s.Player == username);
            score.Strokes = strokes;
            score.RelativeToPar = strokes - Hole.Par;
            score.StrokeSpecs = strokeOutcomes?.Select(outcome => new StrokeSpec {Outcome = Enum.Parse<StrokeSpec.StrokeOutcome>(outcome)}).ToList();
        }

        public Hole Hole { get; set; }
        public List<Score> Scores { get; set; }
    }

    public class Score
    {
        public string Player { get; set; }
        public int Strokes { get; set; }
        public int RelativeToPar { get; set; }

        public List<StrokeSpec> StrokeSpecs { get; set; }
    }

    public class StrokeSpec
    {
        public StrokeOutcome Outcome { get; set; }

        public enum StrokeOutcome
        {
            Fairway,
            Rough,
            OB,
            Circle2,
            Circle1,
            Basket
        }
    }
}