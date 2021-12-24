using System;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class RoundWasStarted : IEvent
    {
        public Guid RoundId { get; set; }
    }


}