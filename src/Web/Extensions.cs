using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Web.Infrastructure;
using Web.Rounds;

namespace Web
{
    public static class Extensions
    {
        public static T[] Populate<T>(this T[] arr, T value)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                arr[i] = value;
            }

            return arr;
        }

        public static IEnumerable<U> Scan<T, U>(this IEnumerable<T> input, Func<U, T, U> next, U state)
        {
            yield return state;
            foreach (var item in input)
            {
                state = next(state, item);
                yield return state;
            }
        }


        public static Task NotifyPlayersInRound(this IHubContext<RoundsHub> hub, Round round)
        {
            return hub.Clients.Group(round.Id.ToString()).SendAsync("roundUpdated",
                JsonConvert.SerializeObject(round, new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()}));
        }
    }
}