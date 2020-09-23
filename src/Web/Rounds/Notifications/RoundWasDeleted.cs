using System;
using System.Collections.Generic;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class RoundWasDeleted : INotification
    {
        public Guid RoundId { get; set; }
        public List<string> Players { get; set; }
    }
}