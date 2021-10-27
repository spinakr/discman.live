using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Web.Common.Mapping;
using Web.Rounds;

namespace Web.Admin.Rounds
{
    public class Rounds : PageModel
    {
        private readonly IMediator _mediator;

        public Rounds(IMediator mediator) => _mediator = mediator;

        public Result Data { get; private set; }

        public async Task OnGetAsync() => Data = await _mediator.Send(new Query());

        public record Query : IRequest<Result>
        {
        }

        public record Result
        {
            public List<RoundVm> Rounds { get; init; }

            public record RoundVm : IMapFrom<Round>
            {
                public DateTime StartTime { get; set; }
                public string CourseName { get; init; }
                public string CourseLayout { get; init; }
            }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly IDocumentSession _documentSession;
            private readonly IMapper _mapper;


            public Handler(IDocumentSession documentSession, IMapper mapper)
            {
                _documentSession = documentSession;
                _mapper = mapper;
            }

            public async Task<Result> Handle(Query message, CancellationToken token)
            {
                var rounds = await _documentSession.Query<Round>()
                    .Where(r => r.IsCompleted && !r.Deleted)
                    .OrderByDescending(r => r.CompletedAt)
                    .Take(20)
                    .ToListAsync(token: token);


                return new Result
                {
                    Rounds = rounds.Select(r => _mapper.Map<Result.RoundVm>(r)).ToList()
                };
            }
        }
    }
}