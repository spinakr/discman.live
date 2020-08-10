using System;
using Web.Common.Mapping;
using Web.Tournaments.Domain;

namespace Web.Tournaments.Queries
{
    public class TournamentListing : IMapFrom<Tournament>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}