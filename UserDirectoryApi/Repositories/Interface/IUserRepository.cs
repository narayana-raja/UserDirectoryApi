using UserDirectoryApi.Models;

namespace UserDirectoryApi.Repositories.Interface;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync();

    Task<User?> GetByIdAsync(int id);

    Task<User> AddAsync(User user);

    Task UpdateAsync(User user);

    Task DeleteAsync(User user);
}
