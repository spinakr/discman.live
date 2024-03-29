using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Web.Common.Mapping;
using Web.Tournaments.Domain;
using Web.Tournaments.Queries;

namespace Web.Users.Queries
{
    public class UserDetails : IMapFrom<User>
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public bool SimpleScoring { get; set; }
        public string Emoji { get; set; }
        public string Country { get; set; }
        public bool RegisterPutDistance { get; set; }
        public int DiscmanPoints { get; set; }
        public double Elo { get; set; }
        public List<string> NewsIdsSeen { get; set; }
        public List<string> Friends { get; set; }
        public Guid? ActiveRound { get; set; }
        public bool SettingsInitialized { get; set; }
        public List<RatingVm> RatingHistory { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDetails>()
                .ForMember(d => d.ActiveRound,
                    opt => opt.Ignore());
        }
    }

    public class RatingVm : IMapFrom<Rating>
    {
        public double Elo { get; set; }
        public DateTime DateTime { get; set; }
    }
}