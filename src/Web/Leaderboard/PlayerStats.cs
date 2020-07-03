namespace Web.Matches
{
    public class PlayerStats
    {
        public string Username { get; set; }
        //Actually average round score (not rename)
        public double AverageHoleScore { get; set; }
        public double CourseAdjustedAverageScore { get; set; }
        public int RoundCount { get; set; }
        public int BirdieCount { get; set; }
        public int BogeyCount { get; set; }
    }
}