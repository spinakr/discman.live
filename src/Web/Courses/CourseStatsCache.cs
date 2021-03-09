using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace Web.Courses
{

    public class CourseStatsCache
    {
        private readonly MemoryCache _cache = new MemoryCache(new MemoryCacheOptions()
        {
            SizeLimit = 100
        });

        public CourseStats GetOrCreate(object key, Func<CourseStats> createItem)
        {
            if (!_cache.TryGetValue(key, out CourseStats cacheEntry))
            {
                cacheEntry = createItem();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSize(1)//Size amount
                    .SetPriority(CacheItemPriority.High)
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5))
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));

                _cache.Set(key, cacheEntry, cacheEntryOptions);
            }
            return cacheEntry;
        }
    }
}