using UserDirectoryApi.Application.Interfaces;
using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Application.Services
{
    public class UserService : IUserService
    {
        // Depend on the repository abstraction; infrastructure implementations can be replaced or mocked.
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _repository.GetAllAsync(cancellationToken);
        }

        public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _repository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<User> CreateAsync(User user, CancellationToken cancellationToken)
        {
            return await _repository.AddAsync(user, cancellationToken);
        }

        public async Task<bool> UpdateAsync(int id, User user, CancellationToken cancellationToken)
        {
            var existingUser = await _repository.GetByIdAsync(id, cancellationToken);

            if (existingUser == null)
            {
                return false;
            }

            existingUser.Name = user.Name;
            existingUser.Age = user.Age;
            existingUser.City = user.City;
            existingUser.State = user.State;
            existingUser.Pincode = user.Pincode;

            await _repository.UpdateAsync(existingUser, cancellationToken);

            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var existingUser = await _repository.GetByIdAsync(id, cancellationToken);

            if (existingUser == null)
            {
                return false;
            }

            await _repository.DeleteAsync(existingUser, cancellationToken);

            return true;
        }
    }
}
