using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Web.Infrastructure
{
    [Authorize]
    [ApiController]
    [Route("api/logger")]
    public class LoggerController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoggerController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("redux")]
        public IActionResult LogReduxError(ReduxLogRequest req)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            Log
                .ForContext("Username", username , destructureObjects: true)
                .ForContext("ReduxState", req.ReduxState , destructureObjects: true)
                .ForContext("ReduxAction", req.ReduxAction, destructureObjects: true)
                .Error("Discman Redux UI exception: {Exception}", req.Exception);
            
            return Ok();
        }
        
        [HttpPost("render")]
        public IActionResult LogRenderError(RenderLogRequest req)
        {
            var username = _httpContextAccessor.HttpContext?.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
            Log
                .ForContext("Username", username , destructureObjects: true)
                .ForContext("RenderExceptionInfo", req.Info , destructureObjects: true)
                .Error("Discman Render UI exception: {Exception}", req.Exception);
            
            return Ok();
        }
    }
    
    public class RenderLogRequest
    {
        public string Exception { get; set; }
        public string Info { get; set; }
    }

    public class ReduxLogRequest
    {
        public string ReduxState { get; set; }
        public string Exception { get; set; }
        public string ReduxAction { get; set; }
    }
}