using NServiceBus;

namespace Web.Users.NSBEvents
{
    public class FriendWasAdded : IEvent
    {
        public string Username { get; set; }
        public string FriendName { get; set; }
    }
}