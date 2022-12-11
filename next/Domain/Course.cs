namespace Discman.Domain;

public class Course
{
    public Course(Guid courseId, string courseName, Layout layout)
    {
        Id = courseId;
        Name = courseName;
        Layout = layout;
    }

    public Guid Id { get; }
    public string Name { get; }
    public Layout Layout { get; }
}

public record Coordinates(decimal Latitude, decimal Longitude);