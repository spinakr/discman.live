using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class RoundWasStarted : IEvent
    {
        public Guid RoundId { get; set; }
    }

    public class RoundWasStartedEventHandler : IHandleMessages<RoundWasStarted>
    {
        private readonly ILogger<RoundWasStartedEventHandler> _logger;

        public RoundWasStartedEventHandler(ILogger<RoundWasStartedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(RoundWasStarted message, IMessageHandlerContext context)
        {
            _logger.LogInformation($"Round was started with roundId: {message.RoundId}");
            return Task.CompletedTask;
        }
    }


}