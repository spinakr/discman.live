using System;

namespace Web.Infrastructure
{
    public class FeatureToggles
    {
        public Guid Id { get; set; }
        public bool ReEvaluateAchievementsDone { get; set; }
        public bool CleanAchievements { get; set; }
    }
}