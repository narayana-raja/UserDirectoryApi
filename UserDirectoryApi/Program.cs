using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Data;
using UserDirectoryApi.Repositories.Interface;
using UserDirectoryApi.Repositories.Implementation;
using UserDirectoryApi.Services.Implementation;
using UserDirectoryApi.Services.Interface;

var builder = WebApplication.CreateBuilder(args);

// Create DataBase folder
var databaseFolder = Path.Combine(
    builder.Environment.ContentRootPath,
    "DataBase");

Directory.CreateDirectory(databaseFolder);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

// Add services to the container
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseExceptionHandler("/error");

// Create database and schema if they don't exist
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    dbContext.Database.EnsureCreated();
}

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();