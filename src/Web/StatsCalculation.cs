using System.Collections.Generic;
using System.Linq;
using Web.Rounds;

namespace Web
{
    public static class StatsCalculation
    {
        public static int PlayerStrokesOfType(this IEnumerable<HoleScore> holes, string player, StrokeSpec.StrokeOutcome outcome)
        {
            return holes.Sum(s => s.StrokeSpecs.Count(spec => spec.Outcome == outcome));
        }

        public static List<HoleScore> PlayerHolesWithDetails(this IReadOnlyList<Round> rounds, string player)
        {
            return rounds
                .SelectMany(r => r.PlayerScores.Where(s => s.PlayerName == player))
                .SelectMany(s => s.Scores)
                .Where(s => s.StrokeSpecs is object && s.StrokeSpecs.Count > 0)
                .ToList();
        }

        public static double PutsPerHole(this IReadOnlyList<HoleScore> holes)
        {
            var holesPlayed = holes.Count;

            var puts = holes.Sum(s =>
                s.StrokeSpecs.Count(spec => spec.Outcome == StrokeSpec.StrokeOutcome.Circle1 || spec.Outcome == StrokeSpec.StrokeOutcome.Circle2));

            return puts / (double) holesPlayed;
        }

        public static double ScrambleRate(this IReadOnlyList<HoleScore> holes)
        {
            var holesWithRoughHit = holes
                .Count(s => s.StrokeSpecs
                    .Count(spec => spec.Outcome == StrokeSpec.StrokeOutcome.Rough || spec.Outcome == StrokeSpec.StrokeOutcome.OB) > 0);

            var scrambles = holes
                .Count(s => (s.StrokeSpecs
                    .Count(spec => spec.Outcome == StrokeSpec.StrokeOutcome.Rough ||
                                   spec.Outcome == StrokeSpec.StrokeOutcome.OB) > 0) && s.RelativeToPar == 0);

            return holesWithRoughHit != 0 ? scrambles / (double) holesWithRoughHit : 0;
        }

        public static double FairwayRate(this IReadOnlyList<HoleScore> holes)
        {
            var holesPlayed = holes.Count;
            var fairwayOnFirst = holes.Count(s =>
                s.StrokeSpecs[0].Outcome == StrokeSpec.StrokeOutcome.Fairway ||
                s.StrokeSpecs[0].Outcome == StrokeSpec.StrokeOutcome.Circle1 ||
                s.StrokeSpecs[0].Outcome == StrokeSpec.StrokeOutcome.Circle2);
            return holesPlayed != 0 ? fairwayOnFirst / (double) holesPlayed : 0;
        }

        public static double OnePutRate(this IReadOnlyList<HoleScore> holes)
        {
            var holesPlayed = holes.Count;
            var onePuts = holes
                .Count(s => s.StrokeSpecs
                    .Count(spec => spec.Outcome == StrokeSpec.StrokeOutcome.Circle1 ||
                                   spec.Outcome == StrokeSpec.StrokeOutcome.Circle2) < 2);
            return holesPlayed != 0 ? onePuts / (double) holesPlayed : 0;
        }
    }
}