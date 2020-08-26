using System;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class UserEarnedAchievement : INotification
    {
        public Guid RoundId { get; set; }
        public string Username { get; set; }
        public string AchievementName { get; set; }
        public DateTime AchievedAt { get; set; }
    }
}