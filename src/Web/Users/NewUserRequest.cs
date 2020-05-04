namespace Web.Users
{
    public class NewUserRequest
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