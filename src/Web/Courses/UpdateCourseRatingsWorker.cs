using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Marten.Util;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Rounds;

namespace Web.Courses
{
    public class UpdateCourseRatingsWorker : IHostedService, IDisposable
    {
        private readonly ILogger<UpdateCourseRatingsWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public UpdateCourseRatingsWorker(ILogger<UpdateCourseRatingsWorker> logger, IDocumentStore documentStore)
        {
            _logger = logger;
            _documentStore = documentStore;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Hosted Service running.");
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(12));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var documentSession = _documentStore.OpenSession();
            var courses = documentSession.Query<Course>().ToList();
            _logger.LogInformation($"Updating ratings of all {courses.Count} courses");
            foreach (var course in courses)
            {
                try
                {
                    var roundsOnCourse = documentSession
                        .Query<Round>()
                        .Where(r => r.CourseName == course.Name)
                        .Where(r => r.StartTime > DateTime.Now.AddYears(-1))
                        .Where(r => r.IsCompleted)
                        .ToList();

                    foreach (var courseHole in course.Holes)
                    {
                        var average = roundsOnCourse
                            .SelectMany(r => r.PlayerScores
                                .Select(s => s.Scores[courseHole.Number - 1]))
                            .Average(s => s.RelativeToPar);
                        courseHole.Average = average;
                    }

                    var orderedHoles = course.Holes.OrderByDescending(s => s.Average).Select(s => s.Number).ToArray();
                    foreach (var courseHole in course.Holes)
                    {
                        courseHole.Rating = Array.IndexOf(orderedHoles, courseHole.Number) + 1;
                    }

                    documentSession.Update(course);
                }
                catch (Exception e)
                {
                    _logger.LogError($"Failed to update ratings of course {course.Id} {course.Name} {e.StackTrace}");
                }
            }

            documentSession.SaveChanges();
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Hosted Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}