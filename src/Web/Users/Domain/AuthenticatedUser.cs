namespace Web.Users
{
    public class AuthenticatedUser
    {
        public AuthenticatedUser(string username, string token, string email)
        {
            Username = username;
            Token = token;
            Email = email;
        }

        public string Username { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
    }
}