use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{get, post},
};
use uuid::Uuid;

use crate::{
    error::{ApiError, log_error_chain},
    pagination::PaginatedResponse,
    state::AppState,
    users::{
        dto::{CreateUserRequest, ListUsersQuery, UpdateUserRequest, UserResponse},
        error::{UserRepositoryError, UserServiceError},
        service,
    },
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", post(create_user).get(list_users))
        .route("/{id}", get(get_user).patch(update_user).delete(delete_user))
}

// Create

async fn create_user(
    State(state): State<AppState>,
    Json(request): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<UserResponse>), ApiError> {
    let response = service::create_user(&state.db, request)
        .await
        .map_err(map_service_error)?;

    Ok((StatusCode::CREATED, Json(response)))
}

// Read

async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<UserResponse>, ApiError> {
    let response = service::get_user(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

async fn list_users(
    State(state): State<AppState>,
    Query(query): Query<ListUsersQuery>,
) -> Result<Json<PaginatedResponse<UserResponse>>, ApiError> {
    let response = service::list_users(&state.db, query)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Update

async fn update_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateUserRequest>,
) -> Result<Json<UserResponse>, ApiError> {
    let response = service::update_user(&state.db, id, request)
        .await
        .map_err(map_service_error)?;

    Ok(Json(response))
}

// Delete

async fn delete_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    service::delete_user(&state.db, id)
        .await
        .map_err(map_service_error)?;

    Ok(StatusCode::NO_CONTENT)
}

fn map_service_error(error: UserServiceError) -> ApiError {
    // Keep user-to-HTTP mapping at the route boundary; status codes are endpoint policy.
    match error {
        error @ UserServiceError::HashPassword(_) => {
            log_error_chain(&error);
            ApiError::internal()
        }
        UserServiceError::Repository(error) => map_repository_error(error),
    }
}

fn map_repository_error(error: UserRepositoryError) -> ApiError {
    match error {
        UserRepositoryError::EmailTaken => ApiError::conflict("email already exists"),
        UserRepositoryError::NotFound => ApiError::not_found("user not found"),
        error @ UserRepositoryError::InvalidRole(_) => {
            log_error_chain(&error);
            ApiError::internal()
        }
        error @ UserRepositoryError::Database(_) => {
            log_error_chain(&error);
            ApiError::internal()
        }
    }
}
