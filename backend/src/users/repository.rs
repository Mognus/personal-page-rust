use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    pagination::Pagination,
    users::{
        error::UserRepositoryError,
        model::{User, UserRole},
    },
};

// Create

pub async fn create_user(
    db: &PgPool,
    email: &str,
    display_name: &str,
    password_hash: &str,
    role: UserRole,
) -> Result<User, UserRepositoryError> {
    // Store roles as constrained text in Postgres, but keep the Rust side typed.
    let role_text = role.as_str();

    // RETURNING keeps DB-generated fields as the source of truth.
    let row = sqlx::query(
        r#"
        INSERT INTO users (email, display_name, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, display_name, created_at, updated_at
        "#,
    )
    .bind(email)
    .bind(display_name)
    .bind(password_hash)
    .bind(role_text)
    .fetch_one(db)
    .await?;

    Ok(User {
        id: row.try_get("id")?,
        email: row.try_get("email")?,
        display_name: row.try_get("display_name")?,
        role,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

// Read

pub async fn find_user_by_id(db: &PgPool, id: Uuid) -> Result<User, UserRepositoryError> {
    let row = sqlx::query(
        r#"
        SELECT id, email, display_name, role, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(db)
    .await?
    .ok_or(UserRepositoryError::NotFound)?;

    let role = row.try_get::<String, _>("role")?;
    let role = UserRole::try_from(role.as_str()).map_err(UserRepositoryError::InvalidRole)?;

    Ok(User {
        id: row.try_get("id")?,
        email: row.try_get("email")?,
        display_name: row.try_get("display_name")?,
        role,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

pub async fn list_users(
    db: &PgPool,
    pagination: Pagination,
) -> Result<Vec<User>, UserRepositoryError> {
    let rows = sqlx::query(
        r#"
        SELECT id, email, display_name, role, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(pagination.limit())
    .bind(pagination.offset())
    .fetch_all(db)
    .await?;

    let mut users = Vec::with_capacity(rows.len());

    for row in rows {
        let role = row.try_get::<String, _>("role")?;
        let role = UserRole::try_from(role.as_str()).map_err(UserRepositoryError::InvalidRole)?;

        users.push(User {
            id: row.try_get("id")?,
            email: row.try_get("email")?,
            display_name: row.try_get("display_name")?,
            role,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        });
    }

    Ok(users)
}

// Update

pub async fn update_user_by_id(
    db: &PgPool,
    id: Uuid,
    email: Option<&str>,
    display_name: Option<&str>,
    password_hash: Option<&str>,
    role: Option<UserRole>,
) -> Result<User, UserRepositoryError> {
    let role_text = role.map(UserRole::as_str);

    let row = sqlx::query(
        r#"
        UPDATE users
        SET
            email = COALESCE($2, email),
            display_name = COALESCE($3, display_name),
            password_hash = COALESCE($4, password_hash),
            role = COALESCE($5, role),
            updated_at = now()
        WHERE id = $1
        RETURNING id, email, display_name, role, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(email)
    .bind(display_name)
    .bind(password_hash)
    .bind(role_text)
    .fetch_optional(db)
    .await?
    .ok_or(UserRepositoryError::NotFound)?;

    let role = row.try_get::<String, _>("role")?;
    let role = UserRole::try_from(role.as_str()).map_err(UserRepositoryError::InvalidRole)?;

    Ok(User {
        id: row.try_get("id")?,
        email: row.try_get("email")?,
        display_name: row.try_get("display_name")?,
        role,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

// Delete

pub async fn delete_user_by_id(db: &PgPool, id: Uuid) -> Result<(), UserRepositoryError> {
    let result = sqlx::query(
        r#"
        DELETE FROM users
        WHERE id = $1
        "#,
    )
    .bind(id)
    .execute(db)
    .await?;

    if result.rows_affected() == 0 {
        return Err(UserRepositoryError::NotFound);
    }

    Ok(())
}
