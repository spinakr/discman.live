using System;

namespace Web.Users.Domain
{
    public class ResetPasswordRequest
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}