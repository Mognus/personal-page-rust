use crate::users::error::UserRepositoryError;

#[derive(Debug, thiserror::Error)]
pub enum AuthServiceError {
    // Hide whether the email lookup or password verification failed.
    #[error("invalid credentials")]
    InvalidCredentials,
    #[error("auth repository failed: {0}")]
    Repository(#[source] UserRepositoryError),
    #[error("failed to create token: {0}")]
    Token(#[from] jsonwebtoken::errors::Error),
    // password_hash::Error is displayed, but not exposed as a std::error source here.
    #[error("failed to verify password: {0}")]
    VerifyPassword(argon2::password_hash::Error),
}

// Kept manual: NotFound is remapped to InvalidCredentials so the boundary
// never reveals whether the email existed.
impl From<UserRepositoryError> for AuthServiceError {
    fn from(error: UserRepositoryError) -> Self {
        match error {
            UserRepositoryError::NotFound => Self::InvalidCredentials,
            error => Self::Repository(error),
        }
    }
}
