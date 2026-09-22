using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Mapster;
using UserDirectoryApi.Application.Interfaces;
using UserDirectoryApi.Application.Mappings;
using UserDirectoryApi.Application.Services;
using UserDirectoryApi.Infrastructure.Persistence;
using UserDirectoryApi.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

UserMappingConfiguration.Register(TypeAdapterConfig.GlobalSettings);

// Create DataBase folder
var databaseFolder = Path.Combine(
    builder.Environment.ContentRootPath,
    "DataBase");

Directory.CreateDirectory(databaseFolder);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var auth0Domain = builder.Configuration["Auth0:Domain"];

        options.Authority = $"https://{auth0Domain}/";
        options.Audience = builder.Configuration["Auth0:Audience"];
        options.RequireHttpsMetadata = builder.Configuration.GetValue(
            "Auth0:RequireHttpsMetadata",
            true);
    });

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();