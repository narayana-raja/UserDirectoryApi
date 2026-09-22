using UserDirectoryApi.Models;
using UserDirectoryApi.Repositories.Interface;
using UserDirectoryApi.Services.Interface;

namespace UserDirectoryApi.Services.Implementation
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<User> CreateAsync(User user)
        {
            return await _repository.AddAsync(user);
        }

        public async Task<bool> UpdateAsync(int id, User user)
        {
            var existingUser = await _repository.GetByIdAsync(id);

            if (existingUser == null)
            {
                return false;
            }

            existingUser.Name = user.Name;
            existingUser.Age = user.Age;
            existingUser.City = user.City;
            existingUser.State = user.State;
            existingUser.Pincode = user.Pincode;

            await _repository.UpdateAsync(existingUser);

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existingUser = await _repository.GetByIdAsync(id);

            if (existingUser == null)
            {
                return false;
            }

            await _repository.DeleteAsync(existingUser);

            return true;
        }
    }
}
