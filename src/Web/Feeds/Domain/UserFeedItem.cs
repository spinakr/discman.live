using System;
using System.Collections.Generic;

namespace Web.Feeds.Domain
{
    public class UserFeedItem
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public Guid FeedItemId { get; set; }
        public ItemType ItemType { get; set; }
        public DateTime RegisteredAt { get; set; }
    }
}