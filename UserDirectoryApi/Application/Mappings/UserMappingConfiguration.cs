using Mapster;
using UserDirectoryApi.Contracts.Users;
using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Application.Mappings;

public static class UserMappingConfiguration
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateUserRequest, User>();

        // The route ID is authoritative during updates and must not be mapped from the request body.
        config.NewConfig<UpdateUserRequest, User>()
            .Ignore(destination => destination.Id);
    }
}