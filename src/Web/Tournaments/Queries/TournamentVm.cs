using System.Collections.Generic;
using Web.Common.Mapping;
using Web.Tournaments.Domain;

namespace Web.Tournaments.Queries
{
    public class TournamentVm
    {
        public TournamentInfo Info { get; set; }
        public TournamentLeaderboard Leaderboard { get; set; }
        public TournamentPricesVm Prices { get; set; }

    }

    public class TournamentPricesVm : IMapFrom<TournamentPrices>
    {

        public List<FinalScoreVm> Scoreboard { get; set; }
        public TournamentPriceVm FastestPlayer { get; set; }
        public TournamentPriceVm SlowestPlayer { get; set; }
        public TournamentPriceVm MostBirdies { get; set; }
        public TournamentPriceVm LeastBogeysOrWorse { get; set; }
        public TournamentPriceVm LongestCleanStreak { get; set; }
        public TournamentPriceVm LongestDrySpell { get; set; }
        public TournamentPriceVm BounceBacks { get; set; }
    }

    public class FinalScoreVm : IMapFrom<FinalScore>
    {
        public string Username { get; set; }
        public int Score { get; set; }
    }

    public class TournamentPriceVm : IMapFrom<TournamentPrice>
    {
        public string Username { get; set; }
        public string ScoreValue { get; set; }
    }
}