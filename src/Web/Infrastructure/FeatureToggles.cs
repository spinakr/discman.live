using System;

namespace Web.Infrastructure
{
    public class FeatureToggles
    {
        public Guid Id { get; set; }
        public bool ReEvaluateAchievementsDone { get; set; }
        public bool CleanAchievements { get; set; }
        public bool CleanAchievements2 { get; set; }
        public bool CleanOldUsersDone { get; set; }
        public bool CleanOldUsersDone2 { get; set; }
        public bool CleanOldUsersDone3 { get; set; }
    }
}