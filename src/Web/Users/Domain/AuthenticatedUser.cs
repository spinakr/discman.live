namespace Web.Users
{
    public class AuthenticatedUser
    {
        public AuthenticatedUser(string username, string token)
        {
            Username = username;
            Token = token;
        }

        public string Username { get; set; }
        public string Token { get; set; }
    }
}