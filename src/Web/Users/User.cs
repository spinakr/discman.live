using System;

namespace Web.Users
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public AuthenticatedUser Authenticated(string token)
        {
            return new AuthenticatedUser(Username, token);
        }
    }
}