using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Web.Matches;

namespace Web.Users
{
    [Authorize]
    [ApiController]
    [Consumes("application/json")]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IDocumentSession _documentSession;
        private readonly Dictionary<string, User> _users;
        private static List<DateTime> FailedLoginRequests = new List<DateTime>();

        public UsersController(ILogger<UsersController> logger, IConfiguration configuration, IDocumentSession documentSession)
        {
            _logger = logger;
            _configuration = configuration;
            _documentSession = documentSession;
            _users = new Dictionary<string, User>
            {
                {
                    "kofoed", new User
                    {
                        Id = Guid.Parse("92de3963-da12-4539-9eb5-4418291f9bf3"),
                        Username = "kofoed",
                        Password = "password"
                    }
                },
                {
                    "test1", new User
                    {
                        Id = Guid.Parse("19be140f-2d0d-4e99-bd1c-37820e5c1d6d"),
                        Username = "test1",
                        Password = "password"
                    }
                },
                {
                    "cbg", new User
                    {
                        Id = Guid.Parse("19be140f-2d0d-4e99-bd1c-37820e5c1d6f"),
                        Username = "cbg",
                        Password = "password"
                    }
                }
            };
        }


        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticationRequest model)
        {
            var requestsLast10Sec = FailedLoginRequests.Count(r => r > DateTime.Now.AddSeconds(-10));
            FailedLoginRequests.RemoveAll(r => r < DateTime.Now.AddSeconds(-20));
            if (requestsLast10Sec > 2)
            {
                return StatusCode(StatusCodes.Status429TooManyRequests);
            }
            
            var secret = _configuration.GetValue<string>("TOKEN_SECRET");
            var userExists = _users.TryGetValue(model.Username, out var user);

            if (!userExists || model.Password != user.Password)
            {
                FailedLoginRequests.Add(DateTime.Now);
                return BadRequest(new {message = "Username or password is incorrect"});
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var authenticatedUser = user.Authenticated(tokenHandler.WriteToken(token));

            return Ok(authenticatedUser);
        }
    }
}