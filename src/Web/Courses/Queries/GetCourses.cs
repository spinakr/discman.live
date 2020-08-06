using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marten;
using MediatR;
using System.Linq;

namespace Web.Courses.Queries
{
    public class GetCoursesQuery : IRequest<IReadOnlyList<Course>>
    {
    }

    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, IReadOnlyList<Course>>
    {
        private readonly IDocumentSession _documentSession;

        public GetCoursesQueryHandler(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public async Task<IReadOnlyList<Course>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            return await _documentSession
                .Query<Course>()
                .OrderByDescending(c => c.CreatedAt)
                .ThenByDescending(c => c.Name)
                .ToListAsync(token: cancellationToken);
        }
    }
}