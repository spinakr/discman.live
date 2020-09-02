using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Web.Feeds.Domain
{
    public class GlobalFeedItem
    {
        public Guid Id { get; set; }

        public ItemType ItemType { get; set; }

        public string AchievementName { get; set; }
        public DateTime RegisteredAt { get; set; }
        public List<string> Subjects { get; set; }
        public string CourseName { get; set; }
        public int HoleScore { get; set; }
        public int HoleNumber { get; set; }
        public List<int> RoundScores { get; set; }

        public Action Action { get; set; }

        public List<string> Likes { get; set; } = new List<string>();
        public Guid RoundId { get; set; }
        public Guid TournamentId { get; set; }
        public string TournamentName { get; set; }
        public string FriendName { get; set; }
    }


    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Action
    {
        Completed,
        Started,
        Joined,
        Added
    }
}