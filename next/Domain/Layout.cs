namespace Discman.Domain;

public class Layout
{
    public string Name { get; set; }
    public List<Hole> Holes { get; }

    public Layout(string name, List<Hole> holes)
    {
        Name = name;
        Holes = holes;
    }
}

public record Hole(int HoleNumber, int Par);