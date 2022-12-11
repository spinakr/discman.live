using Discman.Domain;
using Discman.Domain.Primitves;
using FluentAssertions;

namespace Domain.UnitTests.Round;

public class GivenExistingRound_AddingPlayersAndStartingTheRound : Scenario
{
    private Discman.Domain.Round _round;
    private readonly Username _username = new("Kofoed");
    private readonly Username _newPlayer = new("Torjus");


    public override Task Given()
    {
        _round = Discman.Domain.Round.StartRound(
            new Course(Guid.NewGuid(), "Stovner", new Layout("Winter", new List<Hole> { new Hole(1, 3), new Hole(2, 3) })),
            new Player(Guid.NewGuid(), _username));

        return Task.CompletedTask;
    }

    public override Task When()
    {
        _round.AddPlayer(new Player(Guid.NewGuid(), _newPlayer));

        return Task.CompletedTask;
    }


    [Then]
    public void NewPlayerIsPartOfTheRound()
    {
        _round.Players.Should().ContainSingle(p => p.Username.Value == _newPlayer.Value);
    }
}