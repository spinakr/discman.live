using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NServiceBus;

namespace Web.Rounds.NSBEvents
{
    public class RoundWasCompleted : IEvent
    {
        public Guid RoundId { get; set; }
    }

    public class RoundWasCompletedEventHandler : IHandleMessages<RoundWasCompleted>
    {
        private readonly ILogger<RoundWasCompletedEventHandler> _logger;

        public RoundWasCompletedEventHandler(ILogger<RoundWasCompletedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(RoundWasCompleted message, IMessageHandlerContext context)
        {
            _logger.LogInformation($"Received NSB event with roundId: {message.RoundId}");
            return Task.CompletedTask;
        }
    }


}