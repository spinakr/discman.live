using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Feeds.Commands;
using Web.Feeds.Domain;
using Web.Feeds.Queries;

namespace Web.Feeds
{
    [Authorize]
    [ApiController]
    [Route("api/feeds")]
    public class FeedsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FeedsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserFeed([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string itemType)
        {
            var feed = await _mediator.Send(new GetFeedCommand
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                ItemType = !string.IsNullOrWhiteSpace(itemType) ? Enum.Parse<ItemType>(itemType) : (ItemType?) null
            });
            return Ok(feed);
        }

        [HttpPut("feedItems/{feedItemId}/like")]
        public async Task<IActionResult> ToggleLike(Guid feedItemId)
        {
            await _mediator.Send(new ToggleLikeItemCommand
            {
                FeedItemId = feedItemId
            });
            return Ok();
        }
    }
}