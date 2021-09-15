using System;
using System.Collections.Generic;

namespace Web.Tournaments.Queries
{
    public class TournamentLeaderboard
    {
        public TournamentLeaderboard()
        {
            Scores = new List<TournamentScore>();
        }

        public List<TournamentScore> Scores { get; set; }
    }

    public class TournamentScore
    {
        public string Name { get; set; }
        public int TotalScore { get; set; }
        public int TotalHcpScore { get; set; }
        public List<Guid> CoursesPlayed { get; set; }
    }
}