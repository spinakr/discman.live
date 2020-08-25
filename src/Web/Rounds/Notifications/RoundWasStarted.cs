using System;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class RoundWasStarted : INotification
    {
        public Guid RoundId { get; set; }
    }
}