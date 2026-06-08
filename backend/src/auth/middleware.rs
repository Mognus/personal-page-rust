use axum::{extract::State, extract::Request, middleware::Next, response::Response};

use crate::{
    auth::extract::authenticate, error::ApiError, state::AppState, users::model::UserRole,
};

// Gate middleware for a whole route group: verifies the bearer token and
// rejects unauthenticated requests with 401 before any handler runs.
// It only guards; handlers that need the claims add the AuthUser extractor.
pub async fn require_auth(
    State(state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, ApiError> {
    authenticate(request.headers(), &state.jwt_secret)?;

    Ok(next.run(request).await)
}

// Like require_auth, but additionally rejects non-admins with 403. Used to gate
// admin-only route groups (e.g. /users).
pub async fn require_admin(
    State(state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, ApiError> {
    let claims = authenticate(request.headers(), &state.jwt_secret)?;

    if claims.role != UserRole::Admin {
        return Err(ApiError::forbidden("admin only"));
    }

    Ok(next.run(request).await)
}
