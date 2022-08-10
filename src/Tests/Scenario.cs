using Xunit;

namespace Tests;

public class Scenario
{
    public Scenario()
    {
        Given();
        When();
    }
    
    public void Given(){}
    public void When(){}
}

public class ThenAttribute : FactAttribute { }