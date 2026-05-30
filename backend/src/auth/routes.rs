use axum::{Json, Router, extract::State, routing::post};

use crate::{
    auth::{dto::LoginRequest, error::AuthServiceError, service},
    error::{ApiError, log_error_chain},
    state::AppState,
    users::dto::UserResponse,
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

fn map_service_error(error: AuthServiceError) -> ApiError {
    // Keep auth-to-HTTP mapping at the route boundary; status codes are endpoint policy.
    match error {
        AuthServiceError::InvalidCredentials => ApiError::unauthorized("invalid credentials"),
        error => {
            log_error_chain(&error);
            ApiError::internal()
        }
    }
}
