use axum::{Json, Router, extract::State, routing::post};

use crate::{
    auth::{dto::LoginRequest, service},
    error::ApiError,
    state::AppState,
    users::{dto::UserResponse, error::UserServiceError},
};

pub fn routes() -> Router<AppState> {
    Router::new().route("/login", post(login))
}

async fn login(
    State(state): State<AppState>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<UserResponse>, ApiError> {
    let response = service::login(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

fn map_service_error(error: UserServiceError) -> ApiError {
    match error {
        UserServiceError::InvalidCredentials => ApiError::unauthorized("invalid credentials"),
        _ => ApiError::internal(),
    }
}
