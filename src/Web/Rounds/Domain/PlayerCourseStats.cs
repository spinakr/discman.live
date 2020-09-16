using System.Collections.Generic;
using Web.Rounds.Queries;

namespace Web.Rounds
{
    public class PlayerCourseStats
    {
        public string CourseName { get; set; }
        public string LayoutName { get; set; }
        public string PlayerName { get; set; }
        public double CourseAverage { get; set; }
        public int? PlayerCourseRecord { get; set; }
        public double ThisRoundVsAverage { get; set; }
        public List<double> HoleAverages { get; set; }
        public List<double> AveragePrediction { get; set; }
        public int RoundsPlayed { get; set; }
        public List<HoleStats> HoleStats { get; set; }
    }
}