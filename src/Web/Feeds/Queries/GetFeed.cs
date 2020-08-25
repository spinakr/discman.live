using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Marten;
using Marten.Linq;
using Marten.Pagination;
using MediatR;
using Microsoft.AspNetCore.Http;
using Web.Feeds.Domain;

namespace Web.Feeds.Queries
{
    public class GetFeedCommand : IRequest<FeedVm>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public ItemType? ItemType { get; set; }
    }

    public class GetFeedCommandHandler : IRequestHandler<GetFeedCommand, FeedVm>
    {
        private readonly IDocumentSession _documentSession;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public GetFeedCommandHandler(IDocumentSession documentSession, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _documentSession = documentSession;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        public async Task<FeedVm> Handle(GetFeedCommand request, CancellationToken cancellationToken)
        {
            var authenticatedUsername = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

            var userFeedQuery = _documentSession
                .Query<UserFeedItem>()
                .Where(x => x.Username == authenticatedUsername)
                .OrderByDescending(x => x.RegisteredAt);

            if (request.ItemType != null) userFeedQuery = (IOrderedQueryable<UserFeedItem>) userFeedQuery.Where(x => x.ItemType == request.ItemType);

            var userFeed = await userFeedQuery.ToPagedListAsync(request.PageNumber, request.PageSize, token: cancellationToken);

            var batch = _documentSession.CreateBatchQuery();
            var itemsTask = batch.LoadMany<GlobalFeedItem>().ByIdList(userFeed.Select(x => x.FeedItemId));
            await batch.Execute(cancellationToken);
            var feedItems = await itemsTask;

            return new FeedVm
            {
                FeedItems = feedItems.OrderByDescending(x => x.RegisteredAt).Select(x => _mapper.Map<FeedItemVm>(x)).ToList(),
                IsLastPage = userFeed.IsLastPage
            };
        }
    }
}