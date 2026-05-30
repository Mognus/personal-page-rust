use crate::users::error::UserRepositoryError;

#[derive(Debug)]
pub enum AuthServiceError {
    InvalidCredentials,
    Repository(UserRepositoryError),
    VerifyPassword(argon2::password_hash::Error),
}

impl std::fmt::Display for AuthServiceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidCredentials => write!(formatter, "invalid credentials"),
            Self::Repository(error) => write!(formatter, "auth repository failed: {error}"),
            Self::VerifyPassword(error) => write!(formatter, "failed to verify password: {error}"),
        }
    }
}

impl std::error::Error for AuthServiceError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            // Hide whether the email lookup or password verification failed.
            Self::InvalidCredentials => None,
            Self::Repository(error) => Some(error),
            // password_hash::Error is displayed, but not exposed as a std::error source here.
            Self::VerifyPassword(_) => None,
        }
    }
}

impl From<UserRepositoryError> for AuthServiceError {
    fn from(error: UserRepositoryError) -> Self {
        match error {
            UserRepositoryError::NotFound => Self::InvalidCredentials,
            error => Self::Repository(error),
        }
    }
}
