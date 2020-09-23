using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Remotion.Linq.Clauses;
using Serilog;
using Web.Rounds;

namespace Web.Infrastructure
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
            
            // var rounds = _documentSession
            //     .Query<Round>()
            //     .Where(r => r.PlayerScores.Any(p => p.PlayerName == username))
            //     .Where(r => !r.IsCompleted)
            //     .ToList();
            //
            // foreach (var activeRound in rounds)
            // {
            //     await Groups.AddToGroupAsync(Context.ConnectionId, activeRound.Id.ToString());
            // }
            
            await Groups.AddToGroupAsync(Context.ConnectionId, username);


            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            // await CleanupSpectatorEntries(username);
            await base.OnDisconnectedAsync(exception);
        }


        public async Task SpectatorJoined(Guid roundId)
        {
            var username = Context.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            Log.Information($"{username} joined as spectator");

            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(r => r.Id == roundId);

            if (round is null) return;

            if (round.Spectators.All(s => s != username))
            {
                round.Spectators.Add(username);
                _documentSession.Update(round);
                await _documentSession.SaveChangesAsync();
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, roundId.ToString());

            await Clients.Group(round.Id.ToString()).SendAsync("spectatorJoined", roundId.ToString(), username);
        }

        public async Task SpectatorLeft(Guid roundId)
        {
            var username = Context.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            Log.Information($"{username} left as spectator");

            var round = await _documentSession
                .Query<Round>()
                .SingleOrDefaultAsync(r => r.Id == roundId);

            if (round is null) return;

            if (round.Spectators.Any(s => s == username))
            {
                round.Spectators.Remove(username);
                _documentSession.Update(round);
                await _documentSession.SaveChangesAsync();
            }

            await Clients.Group(round.Id.ToString()).SendAsync("spectatorLeft", roundId.ToString(), username);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roundId.ToString());
        }
        
        private async Task CleanupSpectatorEntries(string username)
        {
            var rounds = await _documentSession
                .Query<Round>()
                .Where(r => !r.IsCompleted)
                .Where(r => r.Spectators.Any(s => s == username))
                .ToListAsync();

            if (rounds.Any())
            {
                foreach (var round in rounds)
                {
                    if (round.Spectators.All(s => s != username)) continue;
                    round.Spectators = round.Spectators.Where(s => s != username).ToList();
                    _documentSession.Update(round);
                    await this.NotifyPlayersOnUpdatedRound(round);
                }

                await _documentSession.SaveChangesAsync();
            }
        }
    }
}