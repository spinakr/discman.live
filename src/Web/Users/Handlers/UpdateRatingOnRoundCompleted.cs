using System.Threading.Tasks;
using NServiceBus;
using Web.Rounds.NSBEvents;

namespace Web.Users.Handlers
{
    // ReSharper disable once UnusedType.Global
    public class UpdateRatingOnRoundCompleted : IHandleMessages<RoundWasCompleted>
    {
        public  Task Handle(RoundWasCompleted message, IMessageHandlerContext context)
        {
            return context.SendLocal(new UpdateRatingsCommand {RoundId = message.RoundId});
        }
    }
}