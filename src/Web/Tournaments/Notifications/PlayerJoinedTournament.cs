using System;
using NServiceBus;

namespace Web.Tournaments.Notifications
{
    public class PlayerJoinedTournament : IEvent
    {
        public string Username { get; set; }
        public Guid TournamentId { get; set; }
        public string TournamentName { get; set; }
    }
}