using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Serilog;
using Web.Users;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace Web.Common.Behaviours
{
    public class LoggingBehaviour<TRequest> : IRequestPreProcessor<TRequest>
    {
        private readonly ILogger _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoggingBehaviour(ILogger<TRequest> logger, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task Process(TRequest request, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            Log
                .ForContext("Request", request, destructureObjects: true)
                .Information("Discman Request: {RequestName} {Username}", requestName, username);
            return Task.CompletedTask;
        }
    }
}