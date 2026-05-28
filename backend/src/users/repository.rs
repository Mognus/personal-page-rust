use sqlx::{PgPool, Row};

use crate::users::model::{User, UserRole};

pub async fn create_user(
    db: &PgPool,
    email: &str,
    display_name: &str,
    password_hash: &str,
    role: UserRole,
) -> Result<User, sqlx::Error> {
    // Store roles as constrained text in Postgres, but keep the Rust side typed.
    let role = role.as_str();

    // RETURNING keeps the DB-generated fields as the source of truth.
    let row = sqlx::query(
        r#"
        INSERT INTO users (email, display_name, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, display_name, role, created_at, updated_at
        "#,
    )
    .bind(email)
    .bind(display_name)
    .bind(password_hash)
    .bind(role)
    .fetch_one(db)
    .await?;

    let role = row.try_get::<String, _>("role")?;
    // Treat invalid persisted roles as decode errors instead of silently falling back.
    let role = UserRole::try_from(role.as_str()).map_err(|error| {
        sqlx::Error::Decode(Box::new(error))
    })?;

    Ok(User {
        id: row.try_get("id")?,
        email: row.try_get("email")?,
        display_name: row.try_get("display_name")?,
        role,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}
