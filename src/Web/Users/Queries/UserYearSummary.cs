namespace Web.Users.Queries
{
    public class UserYearSummary
    {
        public double HoursPlayed { get; set; }
        public int RoundsPlayed { get; set; }
        public double TotalScore { get; set; }
        public string BestCardmate { get; set; }
        public double BestCardmateAverageScore { get; set; }
        public string WorstCardmate { get; set; }
        public double WorstCardmateAverageScore { get; set; }
        public string MostPlayedCourse { get; set; }
        public int MostPlayedCourseRoundsCount { get; set; }

    }
}