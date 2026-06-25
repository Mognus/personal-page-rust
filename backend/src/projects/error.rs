// Repository-level errors translate database details into project-domain language.
#[derive(Debug, thiserror::Error)]
pub enum ProjectRepositoryError {
    #[error("slug already exists")]
    SlugTaken,
    #[error("project not found")]
    NotFound,
    #[error("project repository failed: {0}")]
    Database(#[source] sqlx::Error),
}

impl From<sqlx::Error> for ProjectRepositoryError {
    fn from(error: sqlx::Error) -> Self {
        // Translate the unique-constraint violation into a domain error at the
        // repository boundary, like the users module does for email.
        if let sqlx::Error::Database(database_error) = &error
            && database_error.constraint() == Some("projects_slug_key")
        {
            return Self::SlugTaken;
        }

        Self::Database(error)
    }
}

// Service-level error type that wraps lower-level failures behind one boundary.
#[derive(Debug, thiserror::Error)]
pub enum ProjectServiceError {
    #[error("project repository failed: {0}")]
    Repository(#[from] ProjectRepositoryError),
}
