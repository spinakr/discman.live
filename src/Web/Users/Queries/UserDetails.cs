using System;
using System.Collections.Generic;
using AutoMapper;
using Web.Common.Mapping;
using Web.Tournaments.Domain;
using Web.Tournaments.Queries;

namespace Web.Users.Queries
{
    public class UserDetails : IMapFrom<User>
    {
        public string Email { get; set; }
        public bool SimpleScoring { get; set; } 
        public bool RegisterPutDistance { get; set; } 
        public List<string> NewsIdsSeen { get; set; } 
        public List<string> Friends { get; set; }
        public Guid? ActiveRound { get; set; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDetails>()
                .ForMember(d => d.ActiveRound,
                    opt => opt.Ignore());
        }
    }
}