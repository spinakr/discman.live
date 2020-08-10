using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Web.Matches;
using Web.Tournaments.Queries;

namespace Web.Tournaments
{

    public class TournamentCache
    {
        private readonly MemoryCache _cache = new MemoryCache(new MemoryCacheOptions()
        {
            SizeLimit = 10
        });
 
        public async Task<TournamentLeaderboard> GetOrCreate(object key, Func<Task<TournamentLeaderboard>> createItem)
        {
            if (!_cache.TryGetValue(key, out TournamentLeaderboard cacheEntry))
            {
                cacheEntry = await createItem();
 
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSize(1)//Size amount
                    .SetPriority(CacheItemPriority.High)
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5))
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
 
                _cache.Set(key, cacheEntry, cacheEntryOptions);
            }
            return cacheEntry;
        }
    }}