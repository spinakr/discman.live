using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Infrastructure;
using Web.Rounds;

namespace Web
{
    public static class HubExtensions
    {
        public static Task NotifyPlayersOnUpdatedRound(this IHubContext<RoundsHub> hub, string username, Round round)
        {
            var notifyTasks = round
                .PlayerScores
                .Where(p => p.PlayerName != username)
                .Select(s => hub.Clients.Group(s.PlayerName)
                    .SendAsync("roundUpdated",
                        JsonConvert.SerializeObject(round,
                            new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()})));

            return Task.WhenAll(notifyTasks);
        }

        public static Task NotifyPlayersOnNewRound(this IHubContext<RoundsHub> hub, Round round)
        {
            var notifyTasks = round
                .PlayerScores
                .Where(p => p.PlayerName != round.CreatedBy)
                .Select(s => hub.Clients.Group(s.PlayerName)
                    .SendAsync("newRoundCreated",
                        JsonConvert.SerializeObject(round,
                            new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()})));

            return Task.WhenAll(notifyTasks);
        }

        public static Task NotifyPlayersOnDeletedRound(this IHubContext<RoundsHub> hub, Guid roundId, List<string> notificationPlayers)
        {
            var notifyTasks = notificationPlayers
                .Select(p => hub.Clients.Group(p)
                    .SendAsync("roundDeleted", roundId.ToString()));

            return Task.WhenAll(notifyTasks);
        }

        public static Task NotifyPlayersOnUpdatedRound(this RoundsHub hub, Round round)
        {
            var notifyTasks = round
                .PlayerScores.Select(s => hub.Clients.Group(s.PlayerName)
                    .SendAsync("roundUpdated",
                        JsonConvert.SerializeObject(round,
                            new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()})));

            return Task.WhenAll(notifyTasks);
        }
    }
}