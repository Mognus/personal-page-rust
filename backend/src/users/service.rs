use argon2::{
    Argon2, PasswordHasher,
    PasswordVerifier,
    password_hash::{PasswordHash, SaltString},
};
use rand_core::OsRng;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    pagination::{PaginatedResponse, Pagination},
    users::{
        dto::{CreateUserRequest, ListUsersQuery, LoginRequest, UpdateUserRequest, UserResponse},
        error::{UserRepositoryError, UserServiceError},
        repository,
    },
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

pub async fn login(
    db: &PgPool,
    request: LoginRequest,
) -> Result<UserResponse, UserServiceError> {
    let user = repository::find_user_by_email(db, &request.email)
        .await
        .map_err(|error| match error {
            UserRepositoryError::NotFound => UserServiceError::InvalidCredentials,
            error => UserServiceError::Repository(error),
        })?;

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

// Read

pub async fn get_user(db: &PgPool, id: Uuid) -> Result<UserResponse, UserServiceError> {
    let user = repository::find_user_by_id(db, id).await?;

    Ok(user.into())
}

pub async fn list_users(
    db: &PgPool,
    query: ListUsersQuery,
) -> Result<PaginatedResponse<UserResponse>, UserServiceError> {
    let pagination = Pagination::new(query.page, query.page_size);
    let filters = repository::UserListFilters::from(query);

    let total = repository::count_users(db, &filters).await?;
    let users = repository::list_users(db, pagination, &filters).await?;
    let items = users.into_iter().map(UserResponse::from).collect();

    Ok(PaginatedResponse::new(items, pagination, total))
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

fn verify_password(password: &str, password_hash: &str) -> Result<(), UserServiceError> {
    let parsed_hash = PasswordHash::new(password_hash).map_err(UserServiceError::VerifyPassword)?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(UserServiceError::VerifyPassword)
}
