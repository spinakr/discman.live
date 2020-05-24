using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Web.Users;

namespace Web.Matches
{

    public class UserStatsCache
    {
        private readonly MemoryCache _cache = new MemoryCache(new MemoryCacheOptions()
        {
            SizeLimit = 100
        });
 
        public async Task<UserStats> GetOrCreate(object key, Func<Task<UserStats>> createItem)
        {
            if (!_cache.TryGetValue(key, out UserStats cacheEntry))
            {
                cacheEntry = await createItem();
 
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSize(1)//Size amount
                    .SetPriority(CacheItemPriority.High)
                    .SetSlidingExpiration(TimeSpan.FromMinutes(2))
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
 
                _cache.Set(key, cacheEntry, cacheEntryOptions);
            }
            return cacheEntry;
        }
    }}