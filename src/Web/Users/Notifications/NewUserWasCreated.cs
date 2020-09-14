using MediatR;

namespace Web.Users.Notifications
{
    public class NewUserWasCreated: INotification
    {
        public string Username { get; set; }
    }
}