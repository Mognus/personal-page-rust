use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{get, patch, post},
};
use uuid::Uuid;

use crate::{
    configs::{
        dto::{
            CreateConfigRequest, ListConfigsQuery, ConfigResponse, UpdateConfigRequest,
        },
        error::{ConfigRepositoryError, ConfigServiceError},
        service,
    },
    error::{ApiError, log_error_chain},
    pagination::PaginatedResponse,
    state::AppState,
};

// Public reads: the site lists/opens configs without auth (it passes
// ?visible=true). Mounted without the admin layer in app.rs.
pub fn read_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_configs))
        .route("/{id}", get(get_config))
}

// Mutations are admin-only; app.rs wraps these in require_admin. Merged with
// read_routes on the shared paths (GET vs POST/PATCH/DELETE don't overlap).
pub fn write_routes() -> Router<AppState> {
    Router::new()
        .route("/", post(create_config))
        .route("/{id}", patch(update_config).delete(delete_config))
}

// Create

async fn create_config(
    State(state): State<AppState>,
    Json(request): Json<CreateConfigRequest>,
) -> Result<(StatusCode, Json<ConfigResponse>), ApiError> {
    let response = service::create_config(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok((StatusCode::CREATED, Json(response)))
}

// Read

async fn get_config(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<ConfigResponse>, ApiError> {
    let response = service::get_config(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

async fn list_configs(
    State(state): State<AppState>,
    Query(query): Query<ListConfigsQuery>,
) -> Result<Json<PaginatedResponse<ConfigResponse>>, ApiError> {
    let response = service::list_configs(&state.db, query)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Update

async fn update_config(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateConfigRequest>,
) -> Result<Json<ConfigResponse>, ApiError> {
    let response = service::update_config(&state.db, id, request)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Delete

async fn delete_config(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    service::delete_config(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(StatusCode::NO_CONTENT)
}

fn map_service_error(error: ConfigServiceError) -> ApiError {
    match error {
        ConfigServiceError::Repository(error) => map_repository_error(error),
    }
}

fn map_repository_error(error: ConfigRepositoryError) -> ApiError {
    match error {
        ConfigRepositoryError::SlugTaken => ApiError::conflict("slug already exists"),
        ConfigRepositoryError::NotFound => ApiError::not_found("config not found"),
        error @ ConfigRepositoryError::Database(_) => {
            log_error_chain(&error);
            ApiError::internal()
        }
    }
}
