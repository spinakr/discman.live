using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Web.Matches;
using Web.Rounds;
using Web.Users.Commands;
using Web.Users.Queries;

namespace Web.Users
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public partial class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IDocumentSession _documentSession;
        private readonly IMediator _mediator;
        private static readonly List<DateTime> FailedLoginRequests = new List<DateTime>();
        private readonly string _tokenSecret;

        public UsersController(ILogger<UsersController> logger, IConfiguration configuration, IDocumentSession documentSession, IMediator mediator)
        {
            _logger = logger;
            _configuration = configuration;
            _documentSession = documentSession;
            _mediator = mediator;
            _tokenSecret = _configuration.GetValue<string>("TOKEN_SECRET");
        }


        [AllowAnonymous]
        [HttpPost]
        [Consumes("application/json")]
        public async Task<IActionResult> CreateNewUser(NewUserRequest request)
        {
            var authenticatedUser = await _mediator.Send(new CreateNewUserCommand
            {
                Username = request.Username,
                Password = request.Password
            });

            return Ok(authenticatedUser);
        }

        [AllowAnonymous]
        [Consumes("application/json")]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticationRequest request)
        {
            var authenticatedUser = await _mediator.Send(new AuthenticateUserCommand
            {
                Username = request.Username, Password = request.Password
            });


            if (authenticatedUser is null) return BadRequest(new {message = "Username or password is incorrect"});

            return Ok(authenticatedUser);
        }

        [HttpGet]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchString)
        {
            return Ok(await _mediator.Send(new FindUsersQuery {UsernameSearchString = searchString}));
        }

        [HttpGet("{username}/stats")]
        public async Task<IActionResult> GetUserStats(string username, [FromQuery] DateTime since, [FromQuery] int includeMonths)
        {
            var userStats = await _mediator.Send(new GetUserStatsQuery
            {
                Username = username,
                Since = since,
                IncludeMonths = includeMonths
            });


            return Ok(userStats);
        }

        [HttpGet("{username}/achievements")]
        public async Task<IActionResult> GetUserAchievements(string username)
        {
            var userAchievements = await _mediator.Send(new GetUserAchievementsQuery {Username = username});
            return Ok(userAchievements);
        }


        [HttpPost("friends")]
        public async Task<IActionResult> AddFriend([FromBody] AddFriendsRequest req)
        {
            await _mediator.Send(new AddFriendCommand {Username = req.Username});
            return Ok();
        }

        [HttpGet("friends")]
        public async Task<IActionResult> GetFriendsOf()
        {
            return Ok(await _mediator.Send(new GetUserFriendsQuery()));
        }
    }

    public class AddFriendsRequest
    {
        public string Username { get; set; }
    }
}