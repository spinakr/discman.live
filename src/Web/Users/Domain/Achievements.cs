using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using Web.Rounds;

namespace Web.Users
{
    public class Achievements : ICollection<Achievement>
    {
        private readonly List<Achievement> _achievements;

        public Achievements()
        {
            _achievements = new List<Achievement>();
        }

        public List<Achievement> EvaluatePlayerRound(Guid roundId, string username, Round round)
        {
            var roundAchievements = Assembly.GetCallingAssembly()
                .GetTypes()
                .Where(t => t.IsSubclassOf(typeof(RoundAchievement)));

            var newAchievements = new List<Achievement>();
            foreach (var roundAchievement in roundAchievements)
            {
                var constructor = roundAchievement.GetConstructor(new Type[] {typeof(Guid), typeof(string)});
                var achievementObj = (RoundAchievement) constructor.Invoke(new object[] {roundId, username});
                var evaluationMethod = roundAchievement.GetMethod(nameof(RoundAchievement.Evaluate));
                var res = (bool) evaluationMethod.Invoke(achievementObj, new object[] {round, username});
                if (res && !_achievements.Any(a =>
                    a.AchievementName == achievementObj.AchievementName &&
                    a.RoundId == achievementObj.RoundId))
                {
                    newAchievements.Add(achievementObj);
                }
            }

            _achievements.AddRange(newAchievements);

            return newAchievements;
        }

        public List<Achievement> EvaluateUserRounds(List<Round> userRounds, string username)
        {
            var userAchievements = Assembly.GetCallingAssembly()
                .GetTypes()
                .Where(t => t.IsSubclassOf(typeof(UserAchievement)));

            var newAchievements = new List<Achievement>();
            foreach (var userAchievement in userAchievements)
            {
                var constructor = userAchievement.GetConstructor(new Type[] {typeof(string)});
                var achievementObj = (UserAchievement) constructor.Invoke(new object[] {username});
                var evaluationMethod = userAchievement.GetMethod(nameof(UserAchievement.Evaluate));
                var res = (bool) evaluationMethod.Invoke(achievementObj, new object[] {userRounds});
                if (res && !_achievements.Any(a =>
                    a.AchievementName == achievementObj.AchievementName &&
                    a.AchievedAt.Month == achievementObj.AchievedAt.Month))
                {
                    newAchievements.Add(achievementObj);
                }
            }

            _achievements.AddRange(newAchievements);

            return newAchievements;
        }

        public IEnumerator<Achievement> GetEnumerator()
        {
            return _achievements.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(Achievement item)
        {
            _achievements.Add(item);
        }

        public void Clear()
        {
            _achievements.Clear();
        }

        public bool Contains(Achievement item)
        {
            return _achievements.Contains(item);
        }

        public void CopyTo(Achievement[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        public bool Remove(Achievement item)
        {
            return _achievements.Remove(item);
        }

        public int Count { get; }
        public bool IsReadOnly { get; }
    }

    public abstract class Achievement
    {
        public Achievement(Guid roundId, string username)
        {
            RoundId = roundId;
            Username = username;
            AchievedAt = DateTime.Now;
        }

        public Guid RoundId { get; set; }
        public string Username { get; set; }
        public DateTime AchievedAt { get; set; }
        public string AchievementName => GetType().Name;
    }

    public abstract class RoundAchievement : Achievement
    {
        public abstract bool Evaluate(Round round, string username);

        protected RoundAchievement(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public abstract class UserAchievement : Achievement
    {
        public abstract bool Evaluate(List<Round> rounds);

        protected UserAchievement(string username) : base(Guid.Empty, username)
        {
        }
    }

    public class BogeyFreeRound : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return !playerScore.Scores.Any(s => s.RelativeToPar > 0);
        }

        public BogeyFreeRound(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class AllPar : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.All(s => s.RelativeToPar == 0);
        }

        public AllPar(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class UnderPar : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.Sum(s => s.RelativeToPar) < 0;
        }

        public UnderPar(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class FiveUnderPar : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.Sum(s => s.RelativeToPar) < -4;
        }

        public FiveUnderPar(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class TenUnderPar : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.Sum(s => s.RelativeToPar) < -9;
        }

        public TenUnderPar(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class BogeyRound : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.All(s => s.RelativeToPar > 0);
        }

        public BogeyRound(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class StarFrame : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            if (round.PlayerScores.Count < 3) return false;
            var perHole = new Dictionary<int, bool>();
            foreach (var playerScore in round.PlayerScores)
            {
                foreach (var holeScore in playerScore.Scores)
                {
                    var underPar = holeScore.RelativeToPar < 0;
                    if (!perHole.ContainsKey(holeScore.Hole.Number)) perHole.Add(holeScore.Hole.Number, underPar);
                    else
                    {
                        if (!perHole[holeScore.Hole.Number] || !underPar) perHole[holeScore.Hole.Number] = false;
                    }
                }
            }

            return perHole.Any(h => h.Value);
        }

        public StarFrame(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class FiveBirdieRound : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.Count(s => s.RelativeToPar < 0) > 4;
        }

        public FiveBirdieRound(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class ACE : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.Any(s => s.Strokes == 1);
        }

        public ACE(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class Turkey : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            if (playerScore.Scores.Count < 3) return false;
            for (var i = 0; i < playerScore.Scores.Count - 3; i++)
            {
                var sub = playerScore.Scores.GetRange(i, 3);
                if (sub.All(s => s.RelativeToPar < 0)) return true;
            }

            return false;
        }

        public Turkey(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class OnePutPerHole : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            var onePuts = playerScore.Scores
                .Count(h => h.StrokeSpecs
                    .Count(s => s.Outcome == StrokeSpec.StrokeOutcome.Circle1 || s.Outcome == StrokeSpec.StrokeOutcome.Circle2) <= 1);
            return onePuts == playerScore.Scores.Count;
        }

        public OnePutPerHole(Guid roundId, string username) : base(roundId, username)
        {
        }
    }

    public class OBFree : RoundAchievement
    {
        public override bool Evaluate(Round round, string username)
        {
            var playerScore = round.PlayerScores.Single(s => s.PlayerName == username);
            return playerScore.Scores.All(h => h.StrokeSpecs.All(s => s.Outcome != StrokeSpec.StrokeOutcome.OB));
        }

        public OBFree(Guid roundId, string username) : base(roundId, username)
        {
        }
    }
    
    public class TenRoundsInAMonth : UserAchievement
    {
        public TenRoundsInAMonth(string username) : base(username)
        {
        }

        public override bool Evaluate(List<Round> rounds)
        {
            var perMonth = rounds.GroupBy(r => r.StartTime.Month);
            return perMonth.Any(g => g.Count() > 9);
        }
    }

    public class TwentyRoundsInAMonth : UserAchievement
    {
        public TwentyRoundsInAMonth(string username) : base(username)
        {
        }

        public override bool Evaluate(List<Round> rounds)
        {
            var perMonth = rounds.GroupBy(r => r.StartTime.Month);
            return perMonth.Any(g => g.Count() > 19);
        }
    }

    public class PlayEveryDayInAWeek : UserAchievement
    {
        public PlayEveryDayInAWeek(string username) : base(username)
        {
        }

        public override bool Evaluate(List<Round> rounds)
        {
            var perWeek = rounds.GroupBy(r => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                r.StartTime, CalendarWeekRule.FirstDay, DayOfWeek.Monday));
            return perWeek.Any(w => w.Select(x => x.StartTime.DayOfWeek).Distinct().Count() == 7);
        }
    }
    
    public class FiveRoundsInADay : UserAchievement
    {
        public FiveRoundsInADay(string username) : base(username)
        {
        }

        public override bool Evaluate(List<Round> rounds)
        {
            var perDay = rounds.Where(r => r.StartTime != default).GroupBy(r => r.StartTime.Date);
            return perDay.Any(d => d.Count() > 4);
        }
    }
}