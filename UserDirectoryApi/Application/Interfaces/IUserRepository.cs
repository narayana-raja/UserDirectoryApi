using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Application.Interfaces;

public interface IUserRepository
{
    // Keep the application layer independent from Entity Framework and other persistence details.
    Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<User> AddAsync(User user, CancellationToken cancellationToken);

    Task UpdateAsync(User user, CancellationToken cancellationToken);

    Task DeleteAsync(User user, CancellationToken cancellationToken);
}
