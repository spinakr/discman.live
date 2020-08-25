using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Web.Feeds.Domain;

namespace Web.Feeds
{
    public static class StorageExtensions
    {
        public static void UpdateFriendsFeeds(this IDocumentSession documentSession, List<string> friends, GlobalFeedItem feedItem)
        {
            foreach (var friend in friends)
            {
                documentSession.Store(new UserFeedItem
                {
                    FeedItemId = feedItem.Id,
                    ItemType = feedItem.ItemType,
                    RegisteredAt = feedItem.RegisteredAt,
                    Username = friend
                });
            }
        }
    }
}