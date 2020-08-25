using System;
using MediatR;

namespace Web.Rounds.Notifications
{
    public class RoundWasDeleted : INotification
    {
        public Guid RoundId { get; set; }
    }
}