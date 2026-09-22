using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Application.Interfaces;
using UserDirectoryApi.Domain.Entities;
using UserDirectoryApi.Infrastructure.Persistence;

namespace UserDirectoryApi.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken)
    {
        // Read-only queries should not create tracked EF Core entities unnecessarily.
        return await _context.Users
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken)
    {
        _context.Users.Add(user);

        await _context.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken)
    {
        _context.Users.Update(user);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(User user, CancellationToken cancellationToken)
    {
        _context.Users.Remove(user);

        await _context.SaveChangesAsync(cancellationToken);
    }
}