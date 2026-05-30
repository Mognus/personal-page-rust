use sqlx::{PgPool, QueryBuilder, Row};
use uuid::Uuid;

use crate::{
    pagination::Pagination,
    users::{
        dto::ListUsersQuery,
        error::UserRepositoryError,
        model::{User, UserRole},
    },
};

pub struct UserListFilters {
    pub column_filters: Vec<ColumnFilter>,
    pub search: Option<String>,
}

pub struct ColumnFilter {
    pub column: &'static str,
    pub value: String,
}

const USER_SEARCH_FIELDS: &[&str] = &["email", "display_name"];

impl From<ListUsersQuery> for UserListFilters {
    fn from(query: ListUsersQuery) -> Self {
        let mut column_filters = Vec::new();

        if let Some(role) = query.role {
            column_filters.push(ColumnFilter {
                column: "role",
                value: role.as_str().to_string(),
            });
        }

        Self {
            column_filters,
            search: query.search,
        }
    }
}

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
    filters: &UserListFilters,
) -> Result<Vec<User>, UserRepositoryError> {
    let mut builder = QueryBuilder::new(
        "
        SELECT id, email, display_name, role, created_at, updated_at
        FROM users
        ",
    );

    push_user_filters(&mut builder, filters);

    builder
        .push(" ORDER BY created_at DESC LIMIT ")
        .push_bind(pagination.limit())
        .push(" OFFSET ")
        .push_bind(pagination.offset());

    let rows = builder.build().fetch_all(db).await?;

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

pub async fn count_users(
    db: &PgPool,
    filters: &UserListFilters,
) -> Result<i64, UserRepositoryError> {
    let mut builder = QueryBuilder::new("SELECT COUNT(*) FROM users");

    push_user_filters(&mut builder, filters);

    let total = builder.build_query_scalar().fetch_one(db).await?;

    Ok(total)
}

fn push_user_filters(builder: &mut QueryBuilder<'_, sqlx::Postgres>, filters: &UserListFilters) {
    builder.push(" WHERE true");

    for filter in &filters.column_filters {
        builder
            .push(" AND ")
            .push(filter.column)
            .push(" = ")
            .push_bind(&filter.value);
    }

    if let Some(search) = filters.search.as_deref() {
        let search = search_pattern(search);

        builder.push(" AND (");
        for (index, field) in USER_SEARCH_FIELDS.iter().enumerate() {
            if index > 0 {
                builder.push(" OR ");
            }

            builder.push(*field).push(" ILIKE ").push_bind(&search);
        }
        builder.push(")");
    }
}

fn search_pattern(search: &str) -> String {
    format!("%{search}%")
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
