using MediatR;

namespace Web.Users.Notifications
{
    public class FriendWasAdded: INotification
    {
        public string Username { get; set; }
        public string FriendName { get; set; }
    }
}