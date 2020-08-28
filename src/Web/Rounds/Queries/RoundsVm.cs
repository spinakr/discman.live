using System.Collections.Generic;

namespace Web.Rounds.Queries
{
    public class RoundsVm
    {

        public List<Round> Rounds { get; set; }
        public long Pages { get; set; }
        public long PageNumber { get; set; }
        public long TotalItemCount { get; set; }
    }
}