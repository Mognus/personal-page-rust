use axum::{extract::FromRequestParts, http::header::AUTHORIZATION, http::request::Parts};

use crate::{
    auth::token::{self, Claims},
    error::ApiError,
    state::AppState,
};

// Extractor that authenticates a request from its bearer token.
// Any handler taking `AuthUser` is reachable only with a valid token.
pub struct AuthUser(pub Claims);

impl FromRequestParts<AppState> for AuthUser {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let token = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .and_then(|header| header.strip_prefix("Bearer "))
            .ok_or_else(|| ApiError::unauthorized("missing bearer token"))?;

        let claims = token::verify_access_token(token, &state.jwt_secret)
            // Map any decode failure to a single opaque 401; details go to the log.
            .map_err(|_| ApiError::unauthorized("invalid token"))?;

        Ok(Self(claims))
    }
}
