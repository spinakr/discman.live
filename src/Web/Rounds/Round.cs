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

        public Round(Course course, List<string> players, string createdBy, string roundName)
        {
            Id = Guid.NewGuid();
            CourseName = course.Name;
            StartTime = DateTime.Now;
            PlayerScores = GenerateEmptyScoreCard(course.Holes, players);
            CreatedBy = createdBy;
            RoundName = roundName;
        }

        public Round(List<string> players, string createdBy, string roundName)
        {
            Id = Guid.NewGuid();
            StartTime = DateTime.Now;
            PlayerScores = players
                .Select(p => new PlayerScore
                {
                    PlayerName = p,
                    Scores = new List<HoleScore>()
                }).ToList();
            RoundName = roundName;
            CreatedBy = createdBy;
        }

        public Guid Id { get; set; }

        public ScoreMode ScoreMode { get; set; }
        
        /// <summary>
        /// Optional property usually only used when no course is used 
        /// </summary>
        public string RoundName { get; set; }
        public string CourseName { get; set; }
        public DateTime StartTime { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CompletedAt { get; set; }
        public string CreatedBy { get; set; }

        public List<PlayerScore> PlayerScores { get; set; }

        public bool Deleted { get; set; }

        public double RoundDuration => IsCompleted ? (CompletedAt - StartTime).TotalMinutes : (DateTime.Now - StartTime).TotalMinutes;

        private static List<PlayerScore> GenerateEmptyScoreCard(List<Hole> courseHoles, List<string> players)
        {
            return players
                .Select(p => new PlayerScore
                {
                    PlayerName = p,
                    Scores = courseHoles.Select(h => new HoleScore {Hole = new Hole(h.Number, h.Par, h.Distance, h.Rating, h.Average)}).ToList()
                }).ToList();
        }

        public void AddHole(int holeNumber, int par, int length)
        {
            // if (PlayerScores.First().Scores.Any(s => s.Hole.Number == holeNumber))
            // {
            //     throw new ArgumentException($"Hole number {holeNumber} is already part of the round");
            // }

            foreach (var playerScore in PlayerScores)
            {
                playerScore.Scores.Add(new HoleScore {Hole = new Hole(holeNumber, par, length)});
            }
        }

        public int PlayerScore(string player)
        {
            return PlayerScores
                .Where(s => s.PlayerName == player)
                .SelectMany(s => s.Scores)
                .Sum(q => q.RelativeToPar);
        }

        public double RoundAverageScore()
        {
            return PlayerScores.Sum(ps => ps.Scores.Sum(s => s.RelativeToPar)) / (double) PlayerScores.Count;
        }

        public void CompleteRound()
        {
            IsCompleted = true;
            CompletedAt = DateTime.Now;
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