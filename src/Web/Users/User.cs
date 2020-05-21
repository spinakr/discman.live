using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

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
        }

        public Guid Id { get; set; }
        public string Username { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
        public List<string> Friends { get; set; }

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
            return new AuthenticatedUser(Username, tokenHandler.WriteToken(token));
        }

        public void AddFriend(string username)
        {
            if(Friends is null) Friends = new List<string>();
            Friends = Friends.Distinct().ToList();
            if (Friends.Any(f => f == username)) return;
            Friends.Add(username);
        }
    }
}