// Raised when persisted role text cannot be mapped to a UserRole.
#[derive(Debug, thiserror::Error)]
#[error("invalid user role: {value}")]
pub struct InvalidUserRole {
    pub value: String,
}

// Repository-level errors translate database details into user-domain language.
#[derive(Debug, thiserror::Error)]
pub enum UserRepositoryError {
    #[error("email already exists")]
    EmailTaken,
    #[error("invalid persisted user role: {0}")]
    InvalidRole(#[source] InvalidUserRole),
    #[error("user not found")]
    NotFound,
    #[error("user repository failed: {0}")]
    Database(#[source] sqlx::Error),
}

impl From<sqlx::Error> for UserRepositoryError {
    fn from(error: sqlx::Error) -> Self {
        // Postgres exposes unique violations by constraint name; translate that
        // schema detail into a user-domain error at the repository boundary.
        if let sqlx::Error::Database(database_error) = &error
            && database_error.constraint() == Some("users_email_key")
        {
            return Self::EmailTaken;
        }

        Self::Database(error)
    }
}

// Service-level error type that wraps lower-level failures behind one boundary.
#[derive(Debug, thiserror::Error)]
pub enum UserServiceError {
    // password_hash::Error is displayed, but not exposed as a std::error source here.
    #[error("failed to hash password: {0}")]
    HashPassword(argon2::password_hash::Error),
    #[error("user repository failed: {0}")]
    Repository(#[from] UserRepositoryError),
}

impl From<argon2::password_hash::Error> for UserServiceError {
    fn from(error: argon2::password_hash::Error) -> Self {
        Self::HashPassword(error)
    }
}
