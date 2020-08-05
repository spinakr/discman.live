using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using Web.Matches;
using Web.Rounds;

namespace Web.Users.Queries
{
    public class GetUserAchievementsQuery : IRequest<List<AchievementAndCount>>
    {
        public string Username { get; set; }
    }
    
    public class GetUserAchievementsQueryHandler : IRequestHandler<GetUserAchievementsQuery, List<AchievementAndCount>>
    {
        private readonly IDocumentSession _documentSession;

        public GetUserAchievementsQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        
        public async Task<List<AchievementAndCount>> Handle(GetUserAchievementsQuery request, CancellationToken cancellationToken)
        {
            var user = await _documentSession.Query<User>().SingleAsync(u => u.Username == request.Username, token: cancellationToken);

            var userAchievements = user
                .Achievements
                .GroupBy(x => x.AchievementName)
                .Select(x => new AchievementAndCount
                {
                    Achievement = x.OrderByDescending(y => y.AchievedAt).First(),
                    Count = x.Count()
                })
                .ToList();

            return userAchievements;
        }
        
    }

    public class AchievementAndCount
    {
        public Achievement Achievement { get; set; }
        public int Count { get; set; }
    }
}