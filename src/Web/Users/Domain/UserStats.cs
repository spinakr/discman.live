namespace Web.Users
{
    public class UserStats
    {
        public string Username { get; set; }
        public int RoundsPlayed { get; }
        public int HolesPlayed { get; }
        public double FairwayHitRate { get; }
        public double ScrambleRate { get; }
        public double Circle1Rate { get; }
        public double Circle2Rate { get; }
        public double AverageScore { get; }
        public double StrokesGained { get; }
        public double BirdieRate { get; set; }
        public double ObRate { get; set; }
        public double ParRate { get; set; }

        public UserStats(string username, int roundsPlayed, int holesPlayed, double circle1Rate, double circle2Rate, double fairwayHitRate,
            double scrambleRate,
            double averageScore, double strokesGained, double birdieRate, double obRate, double parRate)
        {
            Username = username;
            this.RoundsPlayed = roundsPlayed;
            this.HolesPlayed = holesPlayed;
            this.Circle1Rate = circle1Rate;
            this.Circle2Rate = circle2Rate;
            this.FairwayHitRate = fairwayHitRate;
            this.ScrambleRate = scrambleRate;
            this.AverageScore = averageScore;
            this.StrokesGained = strokesGained;
            BirdieRate = birdieRate;
            ObRate = obRate;
            ParRate = parRate;
        }

        public static UserStats Empty(string username)
        {
            return new UserStats(username, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
}