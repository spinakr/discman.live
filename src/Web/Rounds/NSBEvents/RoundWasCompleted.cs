using System;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class RoundWasCompleted : IEvent
    {
        public Guid RoundId { get; set; }
    }
}