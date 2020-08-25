using System.Collections.Generic;
using Marten;
using Web.Rounds;
using System.Linq;
using System.Threading.Tasks;
using Web.Tournaments.Domain;

namespace Web.Tournaments.Queries
{
    public static class QueryExtensions
    {
        public static async Task<List<Round>> GetTournamentRounds(this IDocumentSession documentSession, string tournamentPlayer, Tournament tournament)
        {
            var tournamentCourses = tournament.Courses.ToArray();
            var roundsInPeriod = await documentSession
                .Query<Round>()
                .Where(r => !r.Deleted)
                .Where(r => r.PlayerScores.Any(p => p.PlayerName == tournamentPlayer))
                .Where(r => r.StartTime >= tournament.Start.Date && r.StartTime <= tournament.End.Date.AddDays(1))
                .Where(r => r.CourseId.IsOneOf(tournamentCourses))
                .ToListAsync();

            var tournamentRounds = roundsInPeriod
                .Where(r => r.PlayerScores.Count > 1)
                .GroupBy(r => r.CourseId)
                .Select(g => g.OrderBy(r => r.PlayerScore(tournamentPlayer)).First())
                .ToList();

            return tournamentRounds;
        }
    }
}