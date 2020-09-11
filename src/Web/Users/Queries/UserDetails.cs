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
        public List<string> NewsIdsSeen { get; set; } 
        public List<string> Friends { get; set; }
    }
}