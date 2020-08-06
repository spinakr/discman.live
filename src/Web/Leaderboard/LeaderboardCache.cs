using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Web.Matches;

namespace Web.Leaderboard
{

    public class LeaderboardCache
    {
        private readonly MemoryCache _cache = new MemoryCache(new MemoryCacheOptions()
        {
            SizeLimit = 100
        });
 
        public async Task<List<PlayerStats>> GetOrCreate(object key, Func<Task<List<PlayerStats>>> createItem)
        {
            if (!_cache.TryGetValue(key, out List<PlayerStats> cacheEntry))
            {
                cacheEntry = await createItem();
 
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSize(1)//Size amount
                    .SetPriority(CacheItemPriority.High)
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10))
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
 
                _cache.Set(key, cacheEntry, cacheEntryOptions);
            }
            return cacheEntry;
        }
    }}