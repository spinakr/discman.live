using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using Marten.Util;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.Feeds.Domain;
using Web.Rounds;

namespace Web.Courses
{
    public class UpdateCourseLocationsWorker : IHostedService, IDisposable
    {
        private readonly ILogger<UpdateCourseLocationsWorker> _logger;
        private readonly IDocumentStore _documentStore;
        private Timer _timer;

        public UpdateCourseLocationsWorker(ILogger<UpdateCourseLocationsWorker> logger, IDocumentStore documentStore)
        {
            _logger = logger;
            _documentStore = documentStore;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(12));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var documentSession = _documentStore.OpenSession();
            var courses = documentSession.Query<Course>().ToList();
            _logger.LogInformation($"Updating course locations");

            foreach (var course in courses)
            {
                _logger.LogInformation($"Updating course location {course.Name}");
                switch (course.Name)
                {
                    case "Stovner":
                        course.Coordinates = new Coordinates { Latitude = 59.967075791159154M, Longitude = 10.915982727307668M };
                        documentSession.Update(course);
                        break;
                    case "Krokhol":
                        course.Coordinates = new Coordinates { Latitude = 59.80286691964164M, Longitude = 10.92568549103793M };
                        documentSession.Update(course);
                        break;
                    case "Holmenkollen":
                        course.Coordinates = new Coordinates { Latitude = 59.96527712758588M, Longitude = 10.664178709108597M };
                        documentSession.Update(course);
                        break;
                    default:
                        break;

                }
                documentSession.SaveChanges();
            }

        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}