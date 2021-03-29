using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Web.Rounds;

namespace Web.Users
{
    public class User
    {
        public User()
        {
        }

        public User(string requestUsername, SaltSeasonedHashedPassword hashedPw)
        {
            Id = Guid.NewGuid();
            Username = requestUsername;
            Password = hashedPw.Hash;
            Salt = hashedPw.Salt;
            SimpleScoring = true;
            NewsIdsSeen = new List<string>();
            Friends = new List<string>();
            Achievements = new Achievements();
        }

        public Guid Id { get; set; }
        public string Username { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
        public List<string> Friends { get; set; }
        public Achievements Achievements { get; set; }
        public string Email { get; set; }
        public bool SimpleScoring { get; set; } = false;
        public string Emoji { get; set; }
        public string Country { get; set; }
        public string Flag { get; set; }
        public bool RegisterPutDistance { get; set; } = false;
        public List<string> NewsIdsSeen { get; set; } = new List<string>();
        public bool SettingsInitialized { get; set; } = false;
        public AuthenticatedUser Authenticated(string secret)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, Username)
                }),
                Expires = DateTime.UtcNow.AddYears(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return new AuthenticatedUser(Username, tokenHandler.WriteToken(token), Email);
        }

        public void AddFriend(string username)
        {
            if (Friends is null) Friends = new List<string>();
            Friends = Friends.Distinct().ToList();
            if (Friends.Any(f => f == username)) return;
            Friends.Add(username);
        }

        public void ChangePassword(SaltSeasonedHashedPassword hashedPw)
        {
            Salt = hashedPw.Salt;
            Password = hashedPw.Hash;
        }

        public void ChangeEmail(string requestNewEmail)
        {
            Email = requestNewEmail.Trim().ToLowerInvariant();
        }

        public void SetNewsSeen(string requestNewsId)
        {
            if (NewsIdsSeen is null) NewsIdsSeen = new List<string>();
            NewsIdsSeen.Add(requestNewsId);
        }
    }
}