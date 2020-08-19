using System;
using System.Collections.Generic;
using System.Linq;

namespace Web.Tournaments.Domain
{
    public class Tournament
    {
        public Tournament()
        {
        }

        public Tournament(string name, DateTime start, DateTime end, string admin)
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.Now;
            Name = name;
            Players = new List<string> {admin};
            Admins = new List<string> {admin};
            Start = start;
            End = end;
            Courses = new List<Guid>();
        }

        public void AddPlayer(string username)
        {
            if (Players.Any(x => x == username)) return;
            Players.Add(username);
        }

        public void AddCourse(Guid courseId)
        {
            if (Courses.Any(x => x == courseId)) return;
            Courses.Add(courseId);
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<string> Players { get; set; }
        public List<string> Admins { get; set; }

        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public List<Guid> Courses { get; set; }

        public TournamentPrices Prices { get; set; }
    }

    public class TournamentPrices
    {
        public TournamentPrices()
        {
            Scoreboard = new List<FinalScore>();
        }
        
        public List<FinalScore> Scoreboard { get; set; }
        public TournamentPrice FastestPlayer { get; set; }
        public TournamentPrice SlowestPlayer { get; set; }
        public TournamentPrice BestPutter { get; set; }
        public TournamentPrice MostAccurateDriver { get; set; }
    }

    public class FinalScore
    {
        public string Username { get; set; }
        public int Score { get; set; }
    }

    public class TournamentPrice
    {
        public string Username { get; set; }
        public string ScoreValue { get; set; }
    }
}