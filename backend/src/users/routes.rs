use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    routing::post,
};

use crate::{
    error::ApiError,
    state::AppState,
    users::{
        dto::{CreateUserRequest, UserResponse},
        error::UserServiceError,
        service,
    },
};

pub fn routes() -> Router<AppState> {
    Router::new().route("/", post(create_user))
}

async fn create_user(
    State(state): State<AppState>,
    Json(request): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<UserResponse>), ApiError> {
    let response = service::create_user(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok((StatusCode::CREATED, Json(response)))
}

fn map_service_error(error: UserServiceError) -> ApiError {
    match error {
        UserServiceError::HashPassword(_) => ApiError::internal(),
        UserServiceError::Repository(error) => map_repository_error(error),
    }
}

fn map_repository_error(error: sqlx::Error) -> ApiError {
    if let sqlx::Error::Database(error) = &error
        && error.constraint() == Some("users_email_key")
    {
        return ApiError::conflict("email already exists");
    }

    ApiError::internal()
}
