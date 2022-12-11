using Discman.Domain.Events;
using Discman.Domain.Primitves;

namespace Discman.Domain;

public class Round : EventSourcedAggregate
{
    public Course? Course { get; set; }
    public Username? CreatedBy { get; set; }
    public DateTime StartTime { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public bool Deleted { get; }
    public List<Player> Players { get; } = new List<Player>();
    private Round() { }
    public Round(IEnumerable<EventBase> events) : base(events) { }

    public static Round StartRound(Course course, Player startedByPlayer)
    {
        var newRound = new Round();

        newRound.Append(new NewRoundWasStarted(
            roundId: Guid.NewGuid(),
            courseId: course.Id,
            courseName: course.Name,
            layoutName: course.Layout.Name,
            holeDtos: course.Layout.Holes.ConvertAll(h => new NewRoundWasStarted.HoleDto(h.HoleNumber, h.Par)),
            startTime: DateTime.Now,
            createdBy: startedByPlayer.Username.Value));

        newRound.Append(new PlayerWasAddedToRound(
            roundId: newRound.Id,
            playerId: startedByPlayer.UserId,
            username: startedByPlayer.Username.Value));

        return newRound;
    }

    public void AddPlayer(Player player)
    {
        if (CompletedAt != null)
            throw new InvalidOperationException("Cannot add player to completed round");

        Append(new PlayerWasAddedToRound(Id, player.UserId, player.Username.Value));
    }

    #region Event Handlers

    public void Apply(NewRoundWasStarted @event)
    {
        Course = new Course(
            @event.CourseId, @event.CourseName,
            new Layout(@event.LayoutName, @event.Holes.ConvertAll(h => new Hole(h.HoleNumber, h.Par))));
        CreatedBy = new Username(@event.CreatedBy);
        StartTime = @event.StartTime;
    }

    public void Apply(PlayerWasAddedToRound @event)
    {
        Players.Add(new Player(@event.PlayerId, new Username(@event.Username)));
    }
    #endregion
}
