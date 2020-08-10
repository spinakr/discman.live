using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using Marten.Linq;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Courses;
using Web.Rounds;
using Web.Tournaments.Domain;

namespace Web.Tournaments.Queries
{
    public class GetTournamentCommand : IRequest<TournamentVm>
    {
        public Guid TournamentId { get; set; }
    }

    public class GetTournamentCommandHandler : IRequestHandler<GetTournamentCommand, TournamentVm>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IMapper _mapper;
        private readonly TournamentCache _tournamentCache;

        public GetTournamentCommandHandler(IDocumentSession documentSession, IMapper mapper, TournamentCache tournamentCache)
        {
            _documentSession = documentSession;
            _mapper = mapper;
            _tournamentCache = tournamentCache;
        }

        public async Task<TournamentVm> Handle(GetTournamentCommand request, CancellationToken cancellationToken)
        {
            var tournamentVm = new TournamentVm();

            var tournament = await _documentSession.Query<Tournament>().SingleAsync(x => x.Id == request.TournamentId, token: cancellationToken);
            tournamentVm.Info = _mapper.Map<TournamentInfo>(tournament);
            tournamentVm.Info.Courses = tournament.Courses.Select(cid =>
            {
                var course = _documentSession.Query<Course>().Single(c => c.Id == cid);
                return new CourseNameAndId
                {
                    Id = course.Id,
                    Name = course.Name,
                    Layout = course.Layout
                };
            }).ToList();

            if (tournament.Start < DateTime.Now)
            {
                tournamentVm.Leaderboard = await _tournamentCache.GetOrCreate(tournament.Id, () => CalculateLeaderboard(tournament));
            }

            return tournamentVm;
        }

        private async Task<TournamentLeaderboard> CalculateLeaderboard(Tournament tournament)
        {
            var leaderboard = new TournamentLeaderboard();
            var tournamentCourses = tournament.Courses.ToArray();
            foreach (var tournamentPlayer in tournament.Players)
            {
                var roundsInPeriod = await _documentSession
                    .Query<Round>()
                    .Where(r => !r.Deleted)
                    .Where(r => r.PlayerScores.Any(p => p.PlayerName == tournamentPlayer))
                    .Where(r => r.StartTime >= tournament.Start.Date && r.StartTime <= tournament.End.Date.AddDays(1))
                    .Where(r => r.CourseId.IsOneOf(tournamentCourses))
                    .ToListAsync();

                var tournamentRounds = roundsInPeriod
                    // .Where(r => r.PlayerScores.Count > 1)
                    .GroupBy(r => r.CourseId)
                    .Select(g => g.OrderBy(r => r.StartTime).First())
                    .ToList();


                var totalScore = tournamentRounds.Sum(r => r.PlayerScore(tournamentPlayer));
                var coursesPlayed = tournamentRounds.Select(r => r.CourseId).Distinct().ToList();

                leaderboard.Scores.Add(new TournamentScore
                {
                    Name = tournamentPlayer,
                    TotalScore = totalScore,
                    CoursesPlayed = coursesPlayed
                });
            }

            leaderboard.Scores = leaderboard.Scores.OrderBy(s => s.TotalScore).ToList();
            
            return leaderboard;
        }
    }
}