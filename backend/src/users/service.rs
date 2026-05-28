use argon2::{
    Argon2, PasswordHasher,
    password_hash::SaltString,
};
use rand_core::OsRng;
use sqlx::PgPool;

use crate::users::{
    error::UserServiceError,
    model::{CreateUserRequest, UserResponse},
    repository,
};

pub async fn create_user(
    db: &PgPool,
    request: CreateUserRequest,
) -> Result<UserResponse, UserServiceError> {
    // Keep password hashing out of the repository; SQL only receives the hash.
    let password_hash = hash_password(&request.password)?;

    let user = repository::create_user(
        db,
        &request.email,
        &request.display_name,
        &password_hash,
        request.role,
    )
    .await?;

    Ok(user.into())
}
fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);

    Ok(Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string())
}
