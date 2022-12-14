using System.ComponentModel.DataAnnotations;

namespace Web.Users
{
    public class AuthenticationRequest
    {
        private string _username;

        public string Username
        {
            get => _username.Trim().ToLower();
            set => _username = value;
        }

        public string Password { get; set; }
    }
}