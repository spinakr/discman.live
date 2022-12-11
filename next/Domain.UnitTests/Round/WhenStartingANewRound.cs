using Discman.Domain;
using Discman.Domain.Primitves;
using FluentAssertions;

namespace Domain.UnitTests.Round;

public class WhenStartingANewRound : Scenario
{
    private Discman.Domain.Round _round;
    private readonly Username _username = new("Kofoed");

    public override Task Given()
    {
        return Task.CompletedTask;
    }

    public override Task When()
    {
        _round = Discman.Domain.Round.StartRound(
            new Course(Guid.NewGuid(), "Stovner", new Layout("Winter", new List<Hole> { new Hole(1, 3), new Hole(2, 3) })),
            new Player(Guid.NewGuid(), _username));

        return Task.CompletedTask;
    }

    [Then]
    public void ARoundIsStarted()
    {
        _round.StartTime.Should().BeCloseTo(DateTime.Now, new TimeSpan(0, 0, 10));
    }

    [Then]
    public void PlayerWhoStartedTheRoundShouldBeAdded()
    {
        _round.Players.Should().ContainSingle(p => p.Username == _username);
    }
}