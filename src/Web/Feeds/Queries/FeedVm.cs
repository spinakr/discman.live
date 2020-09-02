using System;
using System.Collections.Generic;
using AutoMapper;
using Web.Common.Mapping;
using Web.Feeds.Domain;

namespace Web.Feeds.Queries
{
    public class FeedVm
    {
        public bool IsLastPage { get; set; }
        public List<FeedItemVm> FeedItems { get; set; }
    }

    public class FeedItemVm : IMapFrom<GlobalFeedItem>
    {
        public string ItemType { get; set; }
        public Guid Id { get; set; }
        public DateTime RegisteredAt { get; set; }
        public List<string> Subjects { get; set; }
        public string CourseName { get; set; }
        public int HoleScore { get; set; }
        public int HoleNumber { get; set; }
        public List<int> RoundScores { get; set; }
        public List<string> Likes { get; set; }
        public string Action { get; set; }
        public Guid RoundId { get; set; }
        public string AchievementName { get; set; }
        public Guid TournamentId { get; set; }
        public string TournamentName { get; set; }
        public string FriendName { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<GlobalFeedItem, FeedItemVm>()
                .ForMember(d => d.Action,
                    opt => opt.MapFrom(x => x.Action.ToString()))
                .ForMember(d => d.ItemType,
                    opt => opt.MapFrom(x => x.ItemType.ToString()));
        }
    }
}