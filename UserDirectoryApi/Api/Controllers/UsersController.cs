using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Mapster;
using UserDirectoryApi.Application.Interfaces;
using UserDirectoryApi.Contracts.Users;
using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<User>>> GetAll(
            CancellationToken cancellationToken = default)
        {
            // Propagate the HTTP request cancellation signal through every async layer.
            var users = await _userService.GetAllAsync(cancellationToken);

            return Ok(users);
        }

        // GET: api/users/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetById(
            int id,
            CancellationToken cancellationToken = default)
        {
            var user = await _userService.GetByIdAsync(id, cancellationToken);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> Create(
            CreateUserRequest request,
            CancellationToken cancellationToken = default)
        {
            var user = request.Adapt<User>();

            var createdUser = await _userService.CreateAsync(user, cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdUser.Id },
                createdUser);
        }

        // PUT: api/users/1
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateUserRequest request,
            CancellationToken cancellationToken = default)
        {
            var updated = await _userService.UpdateAsync(
                id,
                request.Adapt<User>(),
                cancellationToken);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/users/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(
            int id,
            CancellationToken cancellationToken = default)
        {
            var deleted = await _userService.DeleteAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
