# Backend Project Structure

The backend is organized by feature/domain first. Shared infrastructure stays in `src/`, while domain-specific code lives in its own folder.

```text
src/
├── app.rs
├── config.rs
├── db.rs
├── error.rs
├── state.rs
└── users/
    ├── dto.rs
    ├── error.rs
    ├── model.rs
    ├── repository.rs
    ├── routes.rs
    └── service.rs
```

## Domain Files

- `model.rs`: domain/internal types, for example `User` and `UserRole`.
- `dto.rs`: API input/output types, for example request and response structs.
- `repository.rs`: database access only. It speaks SQL/database errors.
- `service.rs`: business logic. It validates use cases, hashes passwords, and calls repositories.
- `routes.rs`: HTTP boundary. It extracts Axum state/JSON and returns API responses.
- `error.rs`: domain-specific errors, for example service or conversion errors.

## Error Flow

Each layer uses the error language that belongs to that layer:

```text
repository.rs -> sqlx::Error
service.rs    -> UserServiceError
routes.rs     -> ApiError / HTTP response
```

Routes map domain/service errors into API errors. This keeps the service layer independent from HTTP while still returning useful status codes and JSON responses to clients.
