using Discman.Domain;
using Discman.Domain.Primitves;
using FluentAssertions;

namespace Domain.UnitTests;

public class RoundTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void CreatingNewRound_ShouldInitiateCorrectly()
    {
        var course = new Course(Guid.NewGuid(), "Stovner", new Layout("Winter", new List<Hole> { new Hole(1, 3), new Hole(2, 3) }));

        var round = Discman.Domain.Round.StartRound(course, new Player(Guid.NewGuid(), new Username("Kofoed")));

        round?.Course?.Id.Should().Be(course.Id);
        round?.Course?.Layout.Holes.Count.Should().Be(2);
    }
}