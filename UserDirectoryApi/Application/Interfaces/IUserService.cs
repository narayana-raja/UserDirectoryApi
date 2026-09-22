using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Application.Interfaces;

public interface IUserService
{
    // Expose a read-only collection so callers cannot mutate the service result accidentally.
    Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<User> CreateAsync(User user, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(int id, User user, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
