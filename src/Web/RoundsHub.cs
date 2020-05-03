using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Serilog;
using Web.Matches;

namespace Web
{
    [Authorize]
    public class RoundsHub : Hub
    {
        private readonly IDocumentSession _documentSession;

        public RoundsHub(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public override async Task OnConnectedAsync()
        {
            var username = Context.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var rounds = _documentSession
                .Query<Round>()
                .Where(r => r.Players.Any(p => p == username))
                .Where(r => r.IsActive)
                .ToList();

            foreach (var activeRound in rounds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, activeRound.Id.ToString());
            }

            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}