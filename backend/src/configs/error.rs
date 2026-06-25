// Repository-level errors translate database details into config-domain language.
#[derive(Debug, thiserror::Error)]
pub enum ConfigRepositoryError {
    #[error("slug already exists")]
    SlugTaken,
    #[error("config not found")]
    NotFound,
    #[error("config repository failed: {0}")]
    Database(#[source] sqlx::Error),
}

impl From<sqlx::Error> for ConfigRepositoryError {
    fn from(error: sqlx::Error) -> Self {
        // Translate the unique-constraint violation into a domain error at the
        // repository boundary, like the projects/users modules do.
        if let sqlx::Error::Database(database_error) = &error
            && database_error.constraint() == Some("configs_slug_key")
        {
            return Self::SlugTaken;
        }

        Self::Database(error)
    }
}

// Service-level error type that wraps lower-level failures behind one boundary.
#[derive(Debug, thiserror::Error)]
pub enum ConfigServiceError {
    #[error("config repository failed: {0}")]
    Repository(#[from] ConfigRepositoryError),
}
