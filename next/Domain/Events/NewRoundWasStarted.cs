namespace Discman.Domain.Events
{
    public class NewRoundWasStarted : EventBase
    {
        public NewRoundWasStarted(Guid roundId, Guid courseId, string courseName,
            string layoutName, List<HoleDto> holeDtos, DateTime startTime, string createdBy)
        {
            RoundId = roundId;
            CourseId = courseId;
            CourseName = courseName;
            LayoutName = layoutName;
            Holes = holeDtos;
            StartTime = startTime;
            CreatedBy = createdBy;
        }

        public Guid RoundId { get; }
        public Guid CourseId { get; }
        public string CourseName { get; }
        public string LayoutName { get; }
        public List<HoleDto> Holes { get; }
        public DateTime StartTime { get; }
        public string CreatedBy { get; }

        public record HoleDto(int HoleNumber, int Par);
    }
}