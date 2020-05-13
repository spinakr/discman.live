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
        
        public Round(Course course, List<string> players, string createdBy)
        {
            Id = Guid.NewGuid();
            CourseName = course.Name;
            StartTime = DateTime.Now;
            PlayerScores = GenerateEmptyScoreCard(course.Holes, players);
            CreatedBy = createdBy;
        }

        public Guid Id { get; set; }

        public ScoreMode ScoreMode { get; set; }
        public string CourseName { get; set; }
        public DateTime StartTime { get; set; }

        public bool IsCompleted { get; set; }

        public string CreatedBy { get; set; }

        public List<PlayerScore> PlayerScores { get; set; }


        private static List<PlayerScore> GenerateEmptyScoreCard(List<Hole> courseHoles, List<string> players)
        {
            return players
                .Select(p => new PlayerScore
                {
                    PlayerName = p,
                    Scores = courseHoles.Select(h => new HoleScore {Hole = new Hole(h.Number, h.Par, h.Distance, h.Rating, h.Average)}).ToList()
                }).ToList();
        }
    }

    public enum ScoreMode
    {
        DetailedLive = 0,
        StrokesLive = 1,
        OneForAll = 2
    }

    public class PlayerScore
    {
        public string PlayerName { get; set; }
        public List<HoleScore> Scores { get; set; }
    }

    public class HoleScore
    {
        public void UpdateScore(int strokes, string[] strokeOutcomes)
        {
            Strokes = strokes;
            RelativeToPar = strokes - Hole.Par;
            StrokeSpecs = strokeOutcomes?.Select(outcome => new StrokeSpec {Outcome = Enum.Parse<StrokeSpec.StrokeOutcome>(outcome)}).ToList();
        }

        public Hole Hole { get; set; }
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