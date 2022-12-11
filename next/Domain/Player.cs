using Discman.Domain.Primitves;

namespace Discman.Domain;

public class Player
{
    public Guid UserId { get; }
    public Username Username { get; }
    public List<Score> Scores { get; set; }

    public Player(Guid userId, Username username)
    {
        UserId = userId;
        Username = username;
        Scores = new List<Score>();
    }

    public void AddScore(Score score)
    {
        Scores.Add(score);
    }
}

public class Score
{
    public Score(Hole hole, int numberOfStrokes)
    {
        if (numberOfStrokes < 1) throw new ArgumentException("Number of strokes must be greater than 0");
        if (numberOfStrokes > 50) throw new ArgumentException("Number of strokes must be less than 50");

        Hole = hole;
        Strokes = numberOfStrokes;
    }

    public Hole Hole { get; }
    public int Strokes { get; }
}