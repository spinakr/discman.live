using System;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class ScoreWasUpdated : IEvent
    {
        public Guid RoundId { get; set; }
        public string Username { get; set; }
        public int HoleNumber { get; set; }
        public string CourseName { get; set; }
        public int RelativeScore { get; set; }
        public bool ScoreWasChanged { get; set; }
    }
}