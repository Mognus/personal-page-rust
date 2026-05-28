use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::post,
};
use serde::Serialize;

use crate::{
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

#[derive(Debug, Serialize)]
struct ErrorResponse {
    message: &'static str,
}

struct ApiError {
    status: StatusCode,
    message: &'static str,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (self.status, Json(ErrorResponse { message: self.message })).into_response()
    }
}

fn map_service_error(error: UserServiceError) -> ApiError {
    match error {
        UserServiceError::HashPassword(_) => internal_error(),
        UserServiceError::Repository(error) => map_repository_error(error),
    }
}

fn map_repository_error(error: sqlx::Error) -> ApiError {
    if let sqlx::Error::Database(error) = &error
        && error.constraint() == Some("users_email_key")
    {
        return ApiError {
            status: StatusCode::CONFLICT,
            message: "email already exists",
        };
    }

    internal_error()
}

fn internal_error() -> ApiError {
    ApiError {
        status: StatusCode::INTERNAL_SERVER_ERROR,
        message: "internal server error",
    }
}
