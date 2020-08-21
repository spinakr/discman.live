using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Web.Courses;
using Web.Matches;
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

            if (tournament.Prices != null)
            {
                tournamentVm.Prices = _mapper.Map<TournamentPricesVm>(tournament.Prices);
            }

            return tournamentVm;
        }

        private async Task<TournamentLeaderboard> CalculateLeaderboard(Tournament tournament)
        {
            var leaderboard = new TournamentLeaderboard();
            foreach (var tournamentPlayer in tournament.Players)
            {
                var tournamentRounds = await _documentSession.GetTournamentRounds(tournamentPlayer, tournament);

                var totalScore = tournamentRounds.Sum(r => r.PlayerScore(tournamentPlayer));
                var coursesPlayed = tournamentRounds.Select(r => r.CourseId).Distinct().ToList();

                leaderboard.Scores.Add(new TournamentScore
                {
                    Name = tournamentPlayer,
                    TotalScore = totalScore,
                    CoursesPlayed = coursesPlayed
                });
            }

            leaderboard.Scores = leaderboard.Scores
                .OrderByDescending(s => s.CoursesPlayed)
                .ThenBy(s => s.TotalScore)
                .ToList();

            return leaderboard;
        }
    }
}