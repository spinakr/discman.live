using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Marten;
using Marten.Linq;
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
        private static readonly List<DateTime> FailedLoginRequests = new List<DateTime>();
        private readonly string _tokenSecret;

        public UsersController(ILogger<UsersController> logger, IConfiguration configuration, IDocumentSession documentSession)
        {
            _logger = logger;
            _configuration = configuration;
            _documentSession = documentSession;
            _tokenSecret = _configuration.GetValue<string>("TOKEN_SECRET");
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateNewUser(NewUserRequest request)
        {
            var userExists = await _documentSession.Query<User>().SingleOrDefaultAsync(u => u.Username == request.Username);

            if (userExists is object ||
                request.Password.Length < 5 || request.Password.Length > 200 || request.Username.Length < 3 || request.Username.Length > 30)
            {
                return BadRequest("Terrible request");
            }

            var hashedPw = new SaltSeasonedHashedPassword(request.Password);
            var newUser = new User(request.Username, hashedPw);

            _documentSession.Store(newUser);
            await _documentSession.SaveChangesAsync();
            var authenticatedUser = newUser.Authenticated(_tokenSecret);
            return Ok(authenticatedUser);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticationRequest request)
        {
            var requestsLast10Sec = FailedLoginRequests.Count(r => r > DateTime.Now.AddSeconds(-10));
            FailedLoginRequests.RemoveAll(r => r < DateTime.Now.AddSeconds(-20));
            if (requestsLast10Sec > 2)
            {
                return StatusCode(StatusCodes.Status429TooManyRequests);
            }

            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == request.Username);
            if (user is null)
            {
                FailedLoginRequests.Add(DateTime.Now);
                return BadRequest(new {message = "Username or password is incorrect"});
            }

            var hashedPw = new SaltSeasonedHashedPassword(request.Password, user.Salt);
            if (!hashedPw.Hash.SequenceEqual(user.Password))
            {
                FailedLoginRequests.Add(DateTime.Now);
                return BadRequest(new {message = "Username or password is incorrect"});
            }

            var authenticatedUser = user.Authenticated(_tokenSecret);

            return Ok(authenticatedUser);
        }

        [HttpGet]
        public IActionResult GetFriendsOf([FromQuery] string friendsOf)
        {
            var users = _documentSession.Query<User>().ToList().Select(u => u.Username);
            return Ok(users);
        }
    }
}