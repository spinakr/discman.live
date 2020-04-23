using System.ComponentModel.DataAnnotations;

namespace Web.Users
{
    public class AuthenticationRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }
    }
}