// Raised when persisted role text cannot be mapped to a UserRole.
#[derive(Debug)]
pub struct InvalidUserRole {
    pub value: String,
}

impl std::fmt::Display for InvalidUserRole {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "invalid user role: {}", self.value)
    }
}

impl std::error::Error for InvalidUserRole {}

// Service-level error type that wraps lower-level failures behind one boundary.
#[derive(Debug)]
pub enum UserServiceError {
    HashPassword(argon2::password_hash::Error),
    Repository(sqlx::Error),
}

impl std::fmt::Display for UserServiceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::HashPassword(error) => write!(formatter, "failed to hash password: {error}"),
            Self::Repository(error) => write!(formatter, "user repository failed: {error}"),
        }
    }
}

impl std::error::Error for UserServiceError {}

impl From<argon2::password_hash::Error> for UserServiceError {
    fn from(error: argon2::password_hash::Error) -> Self {
        Self::HashPassword(error)
    }
}

impl From<sqlx::Error> for UserServiceError {
    fn from(error: sqlx::Error) -> Self {
        Self::Repository(error)
    }
}
