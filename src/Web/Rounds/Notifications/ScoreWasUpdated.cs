using System;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class ScoreWasUpdated : INotification
    {
        public Guid RoundId { get; set; }
        public string Username { get; set; }
        public int HoleNumber { get; set; }
        public string CourseName { get; set; }
        public int RelativeScore { get; set; }
        public bool ScoreWasChanged { get; set; }
    }
}