use axum::{extract::State, extract::Request, middleware::Next, response::Response};

use crate::{auth::extract::authenticate, error::ApiError, state::AppState};

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
