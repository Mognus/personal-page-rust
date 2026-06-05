use argon2::{
    Argon2, PasswordVerifier,
    password_hash::PasswordHash,
};
use sqlx::PgPool;

use crate::{
    auth::{
        dto::{LoginRequest, LoginResponse},
        error::AuthServiceError,
        token,
    },
    users::{dto::UserResponse, repository},
};

pub async fn login(
    db: &PgPool,
    request: LoginRequest,
    jwt_secret: &str,
    jwt_expires_in_seconds: i64,
) -> Result<LoginResponse, AuthServiceError> {
    let user = repository::find_user_by_email(db, &request.email).await?;

    verify_password(&request.password, &user.password_hash)
        .map_err(|_| AuthServiceError::InvalidCredentials)?;

    let access_token =
        token::create_access_token(user.id, user.role, jwt_secret, jwt_expires_in_seconds)?;
    let user = UserResponse {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };

    Ok(LoginResponse {
        access_token,
        token_type: "Bearer",
        expires_in: jwt_expires_in_seconds,
        user,
    })
}

fn verify_password(password: &str, password_hash: &str) -> Result<(), AuthServiceError> {
    let parsed_hash = PasswordHash::new(password_hash).map_err(AuthServiceError::VerifyPassword)?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(AuthServiceError::VerifyPassword)
}
