using UserDirectoryApi.Models;

namespace UserDirectoryApi.Services.Interface
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();

        Task<User?> GetByIdAsync(int id);

        Task<User> CreateAsync(User user);

        Task<bool> UpdateAsync(int id, User user);

        Task<bool> DeleteAsync(int id);
    }
}
