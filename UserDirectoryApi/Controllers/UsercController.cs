using Microsoft.AspNetCore.Mvc;
using UserDirectoryApi.DTOs;
using UserDirectoryApi.Models;
using UserDirectoryApi.Services.Interface;

namespace UserDirectoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _userService.GetAllAsync();

            return Ok(users);
        }

        // GET: api/users/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> Create(CreateUserRequest request)
        {
            var user = new User
            {
                Name = request.Name,
                Age = request.Age,
                City = request.City,
                State = request.State,
                Pincode = request.Pincode
            };

            var createdUser = await _userService.CreateAsync(user);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdUser.Id },
                createdUser);
        }

        // PUT: api/users/1
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateUserRequest request)
        {
            var updated = await _userService.UpdateAsync(
                id,
                new User
                {
                    Id = id,
                    Name = request.Name,
                    Age = request.Age,
                    City = request.City,
                    State = request.State,
                    Pincode = request.Pincode
                });

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/users/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _userService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
