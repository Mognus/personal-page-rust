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

// Repository-level errors translate database details into user-domain language.
#[derive(Debug)]
pub enum UserRepositoryError {
    EmailTaken,
    InvalidRole(InvalidUserRole),
    NotFound,
    Database(sqlx::Error),
}

impl std::fmt::Display for UserRepositoryError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::EmailTaken => write!(formatter, "email already exists"),
            Self::InvalidRole(error) => write!(formatter, "invalid persisted user role: {error}"),
            Self::NotFound => write!(formatter, "user not found"),
            Self::Database(error) => write!(formatter, "user repository failed: {error}"),
        }
    }
}

impl std::error::Error for UserRepositoryError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::InvalidRole(error) => Some(error),
            Self::Database(error) => Some(error),
            // These are domain outcomes; the low-level database detail was intentionally translated.
            Self::EmailTaken | Self::NotFound => None,
        }
    }
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
#[derive(Debug)]
pub enum UserServiceError {
    HashPassword(argon2::password_hash::Error),
    Repository(UserRepositoryError),
}

impl std::fmt::Display for UserServiceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::HashPassword(error) => write!(formatter, "failed to hash password: {error}"),
            Self::Repository(error) => write!(formatter, "user repository failed: {error}"),
        }
    }
}

impl std::error::Error for UserServiceError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            // password_hash::Error is displayed, but not exposed as a std::error source here.
            Self::HashPassword(_) => None,
            Self::Repository(error) => Some(error),
        }
    }
}

impl From<argon2::password_hash::Error> for UserServiceError {
    fn from(error: argon2::password_hash::Error) -> Self {
        Self::HashPassword(error)
    }
}

impl From<UserRepositoryError> for UserServiceError {
    fn from(error: UserRepositoryError) -> Self {
        Self::Repository(error)
    }
}
