# User Directory

User Directory is a full-stack user management application. The React SPA provides the user experience, while the .NET API owns validation, authorization, persistence, and CRUD operations.

## Technology

- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core, SQLite, Swagger/OpenAPI
- **Frontend:** React 19, Create React App, React Router, Axios, Lucide React
- **Authentication:** Auth0 OAuth2/OIDC Authorization Code with PKCE and JWT bearer validation
- **Mapping:** Mapster
- **Testing:** MSTest and Moq for the API; Jest and React Testing Library for the SPA

## Structure

```text
UserDirectoryApi/
  Api/Controllers/                 HTTP endpoints and error handling
  Application/Interfaces/          Service and repository abstractions
  Application/Mappings/             Mapster mapping configuration
  Application/Services/             Application use cases
  Contracts/Users/                 API request contracts
  Domain/Entities/                 Core business entities
  Infrastructure/Persistence/      EF Core DbContext and SQLite access
  Infrastructure/Repositories/     Repository implementations

UserDirectoryApi.Test/             API unit tests

user-directory-ui/src/
  app/                             Routing and application shell
  auth/                            Auth0 configuration and token storage
  components/auth/                 Protected route behavior
  components/layout/               Shared navigation
  features/auth/pages/             Login page
  features/users/pages/            User list and user form pages
  features/users/services/         User API functions
  shared/http/                     Axios client and request interceptor
```

## Security

The SPA uses Auth0 for user sign-in. Auth0 issues an access token; Axios attaches it as `Authorization: Bearer <token>`, and the API validates the issuer, signature, audience, and lifetime using Auth0 metadata.

All `UsersController` endpoints require authentication. The API audience is `https://user-directory-api`. No client secret is stored in React.

For local setup:

1. Register a public SPA application and an API in Auth0.
2. Set the API identifier to `https://user-directory-api`.
3. Allow `http://localhost:3000/authentication/callback` as a callback URL.
4. Allow `http://localhost:3000/users` as a logout URL and `http://localhost:3000` as a web origin.
5. Copy `user-directory-ui/.env.example` to `.env.local` and add the Auth0 domain and SPA client ID.
6. Set the same domain and audience in `UserDirectoryApi/appsettings.Development.json`.

## Development Process

1. Define the API contract in `Contracts`, implement the use case in `Application`, and keep persistence details in `Infrastructure`.
2. Map request contracts to domain entities with Mapster; keep controllers focused on HTTP concerns.
3. Use dependency-injected interfaces for service and repository boundaries.
4. Propagate `CancellationToken` through async API operations and use `AsNoTracking` for read-only EF queries.
5. Add focused tests for API behavior, UI workflows, service requests, routing, and authentication states.
6. Validate the full solution before delivery.

## Commands

```powershell
# API tests
dotnet test UserDirectoryApi.slnx

# Start the API
dotnet run --project UserDirectoryApi/UserDirectoryApi.csproj

# React development server
Set-Location user-directory-ui
npm install
npm start

# React tests and production build
npm test -- --watchAll=false --runInBand
npm run build
```

## AI and Tooling Disclosure

Implementation and documentation were developed with GitHub Copilot in Visual Studio Code. Copilot was used for codebase exploration, refactoring suggestions, test generation, documentation drafting, and troubleshooting. All generated changes were reviewed, adapted to the repository, and validated with the automated test and build commands above. Runtime application behavior does not depend on an AI service.