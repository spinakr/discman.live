using System;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class RoundWasCompleted : INotification
    {
        public Guid RoundId { get; set; }
    }
}