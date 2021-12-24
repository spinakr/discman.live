using System;
using System.Collections.Generic;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class RoundWasDeleted : IEvent
    {
        public Guid RoundId { get; set; }
        public List<string> Players { get; set; }
    }
}