namespace Domain.UnitTests;

public abstract class Scenario
{
    public abstract Task Given();
    public abstract Task When();

    [SetUp]
    public async Task Run()
    {
        await Given();
        await When();
    }
}