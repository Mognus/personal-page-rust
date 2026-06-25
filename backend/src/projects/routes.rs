use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{get, patch, post},
};
use uuid::Uuid;

use crate::{
    error::{ApiError, log_error_chain},
    pagination::PaginatedResponse,
    projects::{
        dto::{
            CreateProjectRequest, ListProjectsQuery, ProjectResponse, UpdateProjectRequest,
        },
        error::{ProjectRepositoryError, ProjectServiceError},
        service,
    },
    state::AppState,
};

// Public reads: the site lists/opens projects without auth (it passes
// ?visible=true). Mounted without the admin layer in app.rs.
pub fn read_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_projects))
        .route("/{id}", get(get_project))
}

// Mutations are admin-only; app.rs wraps these in require_admin. Merged with
// read_routes in app.rs — axum combines the GET and PATCH/DELETE method routers
// on the shared "/{id}" path since the methods don't overlap.
pub fn write_routes() -> Router<AppState> {
    Router::new()
        .route("/", post(create_project))
        .route("/{id}", patch(update_project).delete(delete_project))
}

// Create

async fn create_project(
    State(state): State<AppState>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<(StatusCode, Json<ProjectResponse>), ApiError> {
    let response = service::create_project(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok((StatusCode::CREATED, Json(response)))
}

// Read

async fn get_project(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<ProjectResponse>, ApiError> {
    let response = service::get_project(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

async fn list_projects(
    State(state): State<AppState>,
    Query(query): Query<ListProjectsQuery>,
) -> Result<Json<PaginatedResponse<ProjectResponse>>, ApiError> {
    let response = service::list_projects(&state.db, query)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Update

async fn update_project(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateProjectRequest>,
) -> Result<Json<ProjectResponse>, ApiError> {
    let response = service::update_project(&state.db, id, request)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Delete

async fn delete_project(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    service::delete_project(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(StatusCode::NO_CONTENT)
}

fn map_service_error(error: ProjectServiceError) -> ApiError {
    match error {
        ProjectServiceError::Repository(error) => map_repository_error(error),
    }
}

fn map_repository_error(error: ProjectRepositoryError) -> ApiError {
    match error {
        ProjectRepositoryError::SlugTaken => ApiError::conflict("slug already exists"),
        ProjectRepositoryError::NotFound => ApiError::not_found("project not found"),
        error @ ProjectRepositoryError::Database(_) => {
            log_error_chain(&error);
            ApiError::internal()
        }
    }
}
