
using NServiceBus;

namespace Web.Users.NSBEvents
{
    public class NewUserWasCreated : IEvent
    {
        public string Username { get; set; }
    }
}