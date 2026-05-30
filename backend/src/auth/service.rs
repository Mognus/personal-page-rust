use argon2::{
    Argon2, PasswordVerifier,
    password_hash::PasswordHash,
};
use sqlx::PgPool;

use crate::users::{
    dto::UserResponse,
    error::{UserRepositoryError, UserServiceError},
    repository,
};

pub async fn login(
    db: &PgPool,
    request: crate::auth::dto::LoginRequest,
) -> Result<UserResponse, UserServiceError> {
    let user = repository::find_user_by_email(db, &request.email)
        .await
        .map_err(map_login_repository_error)?;

    verify_password(&request.password, &user.password_hash)
        .map_err(|_| UserServiceError::InvalidCredentials)?;

    Ok(UserResponse {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    })
}

fn map_login_repository_error(error: UserRepositoryError) -> UserServiceError {
    match error {
        UserRepositoryError::NotFound => UserServiceError::InvalidCredentials,
        error => UserServiceError::Repository(error),
    }
}

fn verify_password(password: &str, password_hash: &str) -> Result<(), UserServiceError> {
    let parsed_hash = PasswordHash::new(password_hash).map_err(UserServiceError::VerifyPassword)?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(UserServiceError::VerifyPassword)
}
