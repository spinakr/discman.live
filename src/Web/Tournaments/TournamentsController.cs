using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Tournaments.Commands;
using Web.Tournaments.Queries;

namespace Web.Tournaments
{
    [Authorize]
    [ApiController]
    [Route("api/tournaments")]
    public class TournamentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TournamentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserTournaments([FromQuery] bool onlyActive = true)
        {
            var tournament = await _mediator.Send(new GetTournamentsCommand {OnlyActive = onlyActive});
            return Ok(tournament);
        }

        [HttpGet("{tournamentId}")]
        public async Task<IActionResult> GetTournament(Guid tournamentId)
        {
            var tournament = await _mediator.Send(new GetTournamentCommand {TournamentId = tournamentId});
            return Ok(tournament);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewTournament(CreateTournamentCommand request)
        {
            var tournament = await _mediator.Send(request);
            return Ok(tournament);
        }

        [HttpPut("{tournamentId}/courses")]
        public async Task<IActionResult> AddCourse(Guid tournamentId, [FromBody] AddCourseToTournamentCommand request)
        {
            if (tournamentId != request.TournamentId) return BadRequest();
            var tournament = await _mediator.Send(request);
            return Ok(tournament);
        }

        [HttpPut("{tournamentId}/players")]
        public async Task<IActionResult> AddPlayer(Guid tournamentId)
        {
            await _mediator.Send(new AddPlayerToTournamentCommand {TournamentId = tournamentId});
            return Ok();
        }


        [HttpPost("{tournamentId}/calculate")]
        public async Task<IActionResult> CalculatePrices(Guid tournamentId)
        {
            var prices = await _mediator.Send(new CalculatePricesCommand {TournamentId = tournamentId});
            return Ok(prices);
        }
    }
}