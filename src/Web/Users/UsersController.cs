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
using Newtonsoft.Json;
using Web.Matches;
using Web.Rounds;

namespace Web.Users
{
    [Authorize]
    [ApiController]
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
        [Consumes("application/json")]
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
        [Consumes("application/json")]
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

        [HttpGet("stats")]
        public async Task<IActionResult> GetUserStats([FromQuery] DateTime since, [FromQuery] int includeMonths)
        {
            var player = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var rounds = await _documentSession
                .Query<Round>()
                .Where(r => r.PlayerScores.Any(s => s.PlayerName == player))
                .Where(r => r.StartTime > since)
                .Where(r => includeMonths == default || r.StartTime > DateTime.Today.AddMonths(-includeMonths))
                .ToListAsync();

            var holesWithDetails = rounds.PlayerHolesWithDetails(player);

            var roundsPlayed = rounds.Count;
            var holesPlayed = rounds.Sum(r => r.PlayerScores[0].Scores.Count);

            var playerRounds = rounds.Where(r => r.PlayerScores.Any(p => p.PlayerName == player)).ToList();
            var totalScore = playerRounds.Sum(r => r.PlayerScore(player));


            var totalAverageAllPlayers = playerRounds.Sum(r => r.RoundAverageScore()) / playerRounds.Count;
            var playerRoundAverage = totalScore / (double) playerRounds.Count;
            var strokesGained = playerRoundAverage - totalAverageAllPlayers;

            var putsPerHole = holesWithDetails.PutsPerHole();
            var scrambleRate = holesWithDetails.ScrambleRate();
            var fairwayHitRate = holesWithDetails.FairwayRate();
            var onePutRate = holesWithDetails.OnePutRate();


            return Ok(new
            {
                roundsPlayed = roundsPlayed,
                holesPlayed = holesPlayed,
                putsPerHole = putsPerHole,
                fairwayHitRate = fairwayHitRate,
                scrambleRate = scrambleRate,
                onePutRate = onePutRate,
                totalScore = totalScore,
                strokesGained = strokesGained
            });
        }

        [HttpPost("friends")]
        public async Task<IActionResult> AddFriend([FromBody] AddFriendsRequest req)
        {
            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername);
            var friend = await _documentSession.Query<User>().SingleAsync(u => u.Username == req.Username.ToLower());

            user.AddFriend(friend.Username);
            friend.AddFriend(user.Username);

            _documentSession.Update(user);
            _documentSession.Update(friend);
            await _documentSession.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("friends")]
        public async Task<IActionResult> GetFriendsOf()
        {
            var authenticatedUsername = User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == authenticatedUsername);
            return Ok(user.Friends);
        }
    }

    public class AddFriendsRequest
    {
        public string Username { get; set; }
    }
}