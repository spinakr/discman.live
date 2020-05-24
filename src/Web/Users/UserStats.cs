namespace Web.Users
{
    public class UserStats
    {
        public int RoundsPlayed { get; }
        public int HolesPlayed { get; }
        public double PutsPerHole { get; }
        public double FairwayHitRate { get; }
        public double ScrambleRate { get; }
        public double OnePutRate { get; }
        public int TotalScore { get; }
        public double StrokesGained { get; }

        public UserStats(int roundsPlayed, int holesPlayed, double putsPerHole, double fairwayHitRate, double scrambleRate, double onePutRate,
            int totalScore, double strokesGained)
        {
            this.RoundsPlayed = roundsPlayed;
            this.HolesPlayed = holesPlayed;
            this.PutsPerHole = putsPerHole;
            this.FairwayHitRate = fairwayHitRate;
            this.ScrambleRate = scrambleRate;
            this.OnePutRate = onePutRate;
            this.TotalScore = totalScore;
            this.StrokesGained = strokesGained;
        }
    }
}