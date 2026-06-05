use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};

use crate::{
    auth::{
        dto::{LoginRequest, LoginResponse},
        error::AuthServiceError,
        extract::AuthUser,
        service,
    },
    error::{ApiError, log_error_chain},
    state::AppState,
    users::{
        dto::UserResponse,
        error::{UserRepositoryError, UserServiceError},
        service as user_service,
    },
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
        .route("/me", get(me))
}

async fn login(
    State(state): State<AppState>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, ApiError> {
    let response = service::login(
        &state.db,
        request,
        &state.jwt_secret,
        state.jwt_expires_in_seconds,
    )
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Returns the user identified by the bearer token. The AuthUser extractor has
// already validated the token, so reaching this handler means the caller is authenticated.
async fn me(AuthUser(claims): AuthUser, State(state): State<AppState>) -> Result<Json<UserResponse>, ApiError> {
    let response = user_service::get_user(&state.db, claims.sub)
        .await
        .map_err(map_me_error)?;

    Ok(Json(response))
}

fn map_me_error(error: UserServiceError) -> ApiError {
    match error {
        // Token is valid but its user no longer exists: force re-authentication.
        UserServiceError::Repository(UserRepositoryError::NotFound) => {
            ApiError::unauthorized("invalid token")
        }
        error => {
            log_error_chain(&error);
            ApiError::internal()
        }
    }
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
