using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Data;
using UserDirectoryApi.Models;
using UserDirectoryApi.Repositories.Interface;

namespace UserDirectoryApi.Repositories.Implementation;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user)
    {
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
    }
}