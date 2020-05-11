namespace Web.Matches
{
    public class PlayerCourseStats
    {
        public string CourseName { get; set; }
        public string PlayerName { get; set; }
        public double CourseAverage { get; set; }

        public double ThisRoundVsAverage { get; set; }
        public int NumberOfRounds { get; set; }
    }
}