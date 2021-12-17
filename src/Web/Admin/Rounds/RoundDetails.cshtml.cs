using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using MediatR;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Web.Common.Mapping;
using Web.Rounds;
using Web.Users;

namespace Web.Admin.Rounds
{
    public class RoundDetails : PageModel
    {
        private readonly IMediator _mediator;

        public RoundDetails(IMediator mediator) => _mediator = mediator;

        public Result Data { get; private set; }

        public async Task OnGetAsync(Query query) => Data = await _mediator.Send(query);

        public record Query : IRequest<Result>
        {
            public Guid RoundId { get; set; }
        }

        public record Result
        {
            public RoundDetailsVm RoundDetails { get; init; }

            public record RoundDetailsVm : IMapFrom<Round>
            {
                public string CourseName { get; set; }
                public string LayoutName { get; set; }
                public string CreatedBy { get; set; }
                public double RoundDuration { get; set; }
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
                var user = await _documentSession.Query<Round>()
                    .FirstOrDefaultAsync(u => u.Id == message.RoundId, token: token);

                return new Result
                {
                    RoundDetails = _mapper.Map<Result.RoundDetailsVm>(user)
                };
            }
        }
    }
}