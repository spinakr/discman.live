using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Web.Common.Behaviours
{
    public class PerformanceBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly Stopwatch _timer;
        private readonly ILogger<TRequest> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PerformanceBehaviour(ILogger<TRequest> logger, IHttpContextAccessor httpContextAccessor)
        {
            _timer = new Stopwatch();
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            _timer.Start();

            var response = await next();

            _timer.Stop();

            var elapsedMilliseconds = _timer.ElapsedMilliseconds;

            if (elapsedMilliseconds > 100)
            {
                var requestName = typeof(TRequest).Name;
                var username = _httpContextAccessor.HttpContext?.User?.Claims.SingleOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

                _logger.LogWarning("Discman long running request: {RequestName} {ElapsedMilliseconds} {@Username} {@Request}", requestName,
                    elapsedMilliseconds, username, request);
            }

            return response;
        }
    }
}