use axum::{Json, Router, extract::State, http::StatusCode, routing::post};

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
) -> Result<(StatusCode, Json<UserResponse>), StatusCode> {
    let response = service::create_user(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok((StatusCode::CREATED, Json(response)))
}

fn map_service_error(error: UserServiceError) -> StatusCode {
    match error {
        UserServiceError::HashPassword(_) => StatusCode::INTERNAL_SERVER_ERROR,
        UserServiceError::Repository(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
