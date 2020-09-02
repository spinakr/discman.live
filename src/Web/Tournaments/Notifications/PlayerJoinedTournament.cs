using System;
using MediatR;

namespace Web.Tournaments.Notifications
{
    public class PlayerJoinedTournament : INotification
    {
        public string Username { get; set; }
        public Guid TournamentId { get; set; }
        public string TournamentName { get; set; }
    }
}