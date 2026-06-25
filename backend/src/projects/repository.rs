use sqlx::{PgPool, QueryBuilder, Row, postgres::PgRow};
use uuid::Uuid;

use crate::{
    listing::push_search_filter,
    pagination::Pagination,
    projects::{dto::ListProjectsQuery, error::ProjectRepositoryError, model::Project},
};

pub struct ProjectListFilters {
    // None = no constraint (admin sees all); Some(true) = public, visible only.
    pub visible: Option<bool>,
    pub search: Option<String>,
}

const PROJECT_SEARCH_FIELDS: &[&str] = &["slug", "label", "full_name"];

impl From<ListProjectsQuery> for ProjectListFilters {
    fn from(query: ListProjectsQuery) -> Self {
        Self {
            visible: query.visible,
            search: query.search,
        }
    }
}

fn row_to_project(row: &PgRow) -> Result<Project, ProjectRepositoryError> {
    Ok(Project {
        id: row.try_get("id")?,
        slug: row.try_get("slug")?,
        full_name: row.try_get("full_name")?,
        label: row.try_get("label")?,
        position: row.try_get("position")?,
        visible: row.try_get("visible")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

// Create

pub async fn create_project(
    db: &PgPool,
    slug: &str,
    full_name: &str,
    label: &str,
    position: i32,
    visible: bool,
) -> Result<Project, ProjectRepositoryError> {
    let row = sqlx::query(
        r#"
        INSERT INTO projects (slug, full_name, label, position, visible)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, slug, full_name, label, position, visible, created_at, updated_at
        "#,
    )
    .bind(slug)
    .bind(full_name)
    .bind(label)
    .bind(position)
    .bind(visible)
    .fetch_one(db)
    .await?;

    row_to_project(&row)
}

// Read

pub async fn find_project_by_id(
    db: &PgPool,
    id: Uuid,
) -> Result<Project, ProjectRepositoryError> {
    let row = sqlx::query(
        r#"
        SELECT id, slug, full_name, label, position, visible, created_at, updated_at
        FROM projects
        WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(db)
    .await?
    .ok_or(ProjectRepositoryError::NotFound)?;

    row_to_project(&row)
}

pub async fn list_projects(
    db: &PgPool,
    pagination: Pagination,
    filters: &ProjectListFilters,
) -> Result<Vec<Project>, ProjectRepositoryError> {
    let mut builder = QueryBuilder::new(
        "SELECT id, slug, full_name, label, position, visible, created_at, updated_at FROM projects",
    );

    push_project_filters(&mut builder, filters);

    // position drives the public ordering (and the derived enso angle); fall
    // back to created_at so equal positions stay deterministic.
    builder
        .push(" ORDER BY position ASC, created_at DESC LIMIT ")
        .push_bind(pagination.limit())
        .push(" OFFSET ")
        .push_bind(pagination.offset());

    let rows: Vec<PgRow> = builder.build().fetch_all(db).await?;

    rows.iter().map(row_to_project).collect()
}

pub async fn count_projects(
    db: &PgPool,
    filters: &ProjectListFilters,
) -> Result<i64, ProjectRepositoryError> {
    let mut builder = QueryBuilder::new("SELECT COUNT(*) FROM projects");

    push_project_filters(&mut builder, filters);

    let total = builder.build_query_scalar().fetch_one(db).await?;

    Ok(total)
}

fn push_project_filters(
    builder: &mut QueryBuilder<sqlx::Postgres>,
    filters: &ProjectListFilters,
) {
    builder.push(" WHERE true");

    if let Some(visible) = filters.visible {
        builder.push(" AND visible = ").push_bind(visible);
    }

    push_search_filter(builder, filters.search.as_deref(), PROJECT_SEARCH_FIELDS);
}

// Update

pub async fn update_project_by_id(
    db: &PgPool,
    id: Uuid,
    slug: Option<&str>,
    full_name: Option<&str>,
    label: Option<&str>,
    position: Option<i32>,
    visible: Option<bool>,
) -> Result<Project, ProjectRepositoryError> {
    let row = sqlx::query(
        r#"
        UPDATE projects
        SET
            slug = COALESCE($2, slug),
            full_name = COALESCE($3, full_name),
            label = COALESCE($4, label),
            position = COALESCE($5, position),
            visible = COALESCE($6, visible),
            updated_at = now()
        WHERE id = $1
        RETURNING id, slug, full_name, label, position, visible, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(slug)
    .bind(full_name)
    .bind(label)
    .bind(position)
    .bind(visible)
    .fetch_optional(db)
    .await?
    .ok_or(ProjectRepositoryError::NotFound)?;

    row_to_project(&row)
}

// Delete

pub async fn delete_project_by_id(
    db: &PgPool,
    id: Uuid,
) -> Result<(), ProjectRepositoryError> {
    let result = sqlx::query("DELETE FROM projects WHERE id = $1")
        .bind(id)
        .execute(db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(ProjectRepositoryError::NotFound);
    }

    Ok(())
}
