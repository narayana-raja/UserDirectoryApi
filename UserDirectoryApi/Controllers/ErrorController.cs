using Microsoft.AspNetCore.Mvc;

namespace UserDirectoryApi.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        [Route("/error")]
        public IActionResult Error()
        {
            return Problem(
                statusCode: StatusCodes.Status500InternalServerError,
                title: "An unexpected error occurred.");
        }
    }
}
