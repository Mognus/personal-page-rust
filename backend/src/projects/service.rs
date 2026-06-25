use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    pagination::{PaginatedResponse, Pagination},
    projects::{
        dto::{CreateProjectRequest, ListProjectsQuery, ProjectResponse, UpdateProjectRequest},
        error::ProjectServiceError,
        repository,
    },
};

// Create

pub async fn create_project(
    db: &PgPool,
    request: CreateProjectRequest,
) -> Result<ProjectResponse, ProjectServiceError> {
    let project = repository::create_project(
        db,
        &request.slug,
        &request.full_name,
        &request.label,
        request.position,
        request.visible,
    )
    .await?;

    Ok(project.into())
}

// Read

pub async fn get_project(db: &PgPool, id: Uuid) -> Result<ProjectResponse, ProjectServiceError> {
    let project = repository::find_project_by_id(db, id).await?;

    Ok(project.into())
}

pub async fn list_projects(
    db: &PgPool,
    query: ListProjectsQuery,
) -> Result<PaginatedResponse<ProjectResponse>, ProjectServiceError> {
    let pagination = Pagination::new(query.page, query.page_size);
    let filters = repository::ProjectListFilters::from(query);

    let total = repository::count_projects(db, &filters).await?;
    let projects = repository::list_projects(db, pagination, &filters).await?;
    let items = projects.into_iter().map(ProjectResponse::from).collect();

    Ok(PaginatedResponse::new(items, pagination, total))
}

// Update

pub async fn update_project(
    db: &PgPool,
    id: Uuid,
    request: UpdateProjectRequest,
) -> Result<ProjectResponse, ProjectServiceError> {
    let project = repository::update_project_by_id(
        db,
        id,
        request.slug.as_deref(),
        request.full_name.as_deref(),
        request.label.as_deref(),
        request.position,
        request.visible,
    )
    .await?;

    Ok(project.into())
}

// Delete

pub async fn delete_project(db: &PgPool, id: Uuid) -> Result<(), ProjectServiceError> {
    repository::delete_project_by_id(db, id).await?;

    Ok(())
}
