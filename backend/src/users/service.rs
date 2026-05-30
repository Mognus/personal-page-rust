use argon2::{
    Argon2, PasswordHasher,
    password_hash::SaltString,
};
use rand_core::OsRng;
use sqlx::PgPool;
use uuid::Uuid;

use crate::users::{
    dto::{CreateUserRequest, UpdateUserRequest, UserResponse},
    error::UserServiceError,
    repository,
};

// Create

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

// Read

pub async fn get_user(db: &PgPool, id: Uuid) -> Result<UserResponse, UserServiceError> {
    let user = repository::find_user_by_id(db, id).await?;

    Ok(user.into())
}

// Update

pub async fn update_user(
    db: &PgPool,
    id: Uuid,
    request: UpdateUserRequest,
) -> Result<UserResponse, UserServiceError> {
    let password_hash = match request.password.as_deref() {
        Some(password) => Some(hash_password(password)?),
        None => None,
    };

    let user = repository::update_user_by_id(
        db,
        id,
        request.email.as_deref(),
        request.display_name.as_deref(),
        password_hash.as_deref(),
        request.role,
    )
    .await?;

    Ok(user.into())
}

// Delete

pub async fn delete_user(db: &PgPool, id: Uuid) -> Result<(), UserServiceError> {
    repository::delete_user_by_id(db, id).await?;

    Ok(())
}

fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);

    Ok(Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string())
}
