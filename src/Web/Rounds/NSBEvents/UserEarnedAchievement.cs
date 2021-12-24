using System;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class UserEarnedAchievement : IEvent
    {
        public Guid RoundId { get; set; }
        public string Username { get; set; }
        public string AchievementName { get; set; }
        public DateTime AchievedAt { get; set; }
    }
}