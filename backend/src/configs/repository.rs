use sqlx::{PgPool, QueryBuilder, Row, postgres::PgRow};
use uuid::Uuid;

use crate::{
    configs::{dto::ListConfigsQuery, error::ConfigRepositoryError, model::Config},
    listing::push_search_filter,
    pagination::Pagination,
};

pub struct ConfigListFilters {
    // None = no constraint (admin sees all); Some(true) = public, visible only.
    pub visible: Option<bool>,
    pub search: Option<String>,
}

const CONFIG_SEARCH_FIELDS: &[&str] = &["slug", "label", "path"];

impl From<ListConfigsQuery> for ConfigListFilters {
    fn from(query: ListConfigsQuery) -> Self {
        Self {
            visible: query.visible,
            search: query.search,
        }
    }
}

fn row_to_config(row: &PgRow) -> Result<Config, ConfigRepositoryError> {
    Ok(Config {
        id: row.try_get("id")?,
        slug: row.try_get("slug")?,
        label: row.try_get("label")?,
        icon: row.try_get("icon")?,
        path: row.try_get("path")?,
        position: row.try_get("position")?,
        visible: row.try_get("visible")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

// Create

pub async fn create_config(
    db: &PgPool,
    slug: &str,
    label: &str,
    icon: &str,
    path: &str,
    position: i32,
    visible: bool,
) -> Result<Config, ConfigRepositoryError> {
    let row = sqlx::query(
        r#"
        INSERT INTO configs (slug, label, icon, path, position, visible)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, slug, label, icon, path, position, visible, created_at, updated_at
        "#,
    )
    .bind(slug)
    .bind(label)
    .bind(icon)
    .bind(path)
    .bind(position)
    .bind(visible)
    .fetch_one(db)
    .await?;

    row_to_config(&row)
}

// Read

pub async fn find_config_by_id(
    db: &PgPool,
    id: Uuid,
) -> Result<Config, ConfigRepositoryError> {
    let row = sqlx::query(
        r#"
        SELECT id, slug, label, icon, path, position, visible, created_at, updated_at
        FROM configs
        WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(db)
    .await?
    .ok_or(ConfigRepositoryError::NotFound)?;

    row_to_config(&row)
}

pub async fn list_configs(
    db: &PgPool,
    pagination: Pagination,
    filters: &ConfigListFilters,
) -> Result<Vec<Config>, ConfigRepositoryError> {
    let mut builder = QueryBuilder::new(
        "SELECT id, slug, label, icon, path, position, visible, created_at, updated_at FROM configs",
    );

    push_config_filters(&mut builder, filters);

    // position drives the public ordering; created_at keeps ties deterministic.
    builder
        .push(" ORDER BY position ASC, created_at DESC LIMIT ")
        .push_bind(pagination.limit())
        .push(" OFFSET ")
        .push_bind(pagination.offset());

    let rows: Vec<PgRow> = builder.build().fetch_all(db).await?;

    rows.iter().map(row_to_config).collect()
}

pub async fn count_configs(
    db: &PgPool,
    filters: &ConfigListFilters,
) -> Result<i64, ConfigRepositoryError> {
    let mut builder = QueryBuilder::new("SELECT COUNT(*) FROM configs");

    push_config_filters(&mut builder, filters);

    let total = builder.build_query_scalar().fetch_one(db).await?;

    Ok(total)
}

fn push_config_filters(
    builder: &mut QueryBuilder<sqlx::Postgres>,
    filters: &ConfigListFilters,
) {
    builder.push(" WHERE true");

    if let Some(visible) = filters.visible {
        builder.push(" AND visible = ").push_bind(visible);
    }

    push_search_filter(builder, filters.search.as_deref(), CONFIG_SEARCH_FIELDS);
}

// Update

pub async fn update_config_by_id(
    db: &PgPool,
    id: Uuid,
    slug: Option<&str>,
    label: Option<&str>,
    icon: Option<&str>,
    path: Option<&str>,
    position: Option<i32>,
    visible: Option<bool>,
) -> Result<Config, ConfigRepositoryError> {
    let row = sqlx::query(
        r#"
        UPDATE configs
        SET
            slug = COALESCE($2, slug),
            label = COALESCE($3, label),
            icon = COALESCE($4, icon),
            path = COALESCE($5, path),
            position = COALESCE($6, position),
            visible = COALESCE($7, visible),
            updated_at = now()
        WHERE id = $1
        RETURNING id, slug, label, icon, path, position, visible, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(slug)
    .bind(label)
    .bind(icon)
    .bind(path)
    .bind(position)
    .bind(visible)
    .fetch_optional(db)
    .await?
    .ok_or(ConfigRepositoryError::NotFound)?;

    row_to_config(&row)
}

// Delete

pub async fn delete_config_by_id(
    db: &PgPool,
    id: Uuid,
) -> Result<(), ConfigRepositoryError> {
    let result = sqlx::query("DELETE FROM configs WHERE id = $1")
        .bind(id)
        .execute(db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(ConfigRepositoryError::NotFound);
    }

    Ok(())
}
