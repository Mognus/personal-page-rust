use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    configs::{
        dto::{CreateConfigRequest, ListConfigsQuery, ConfigResponse, UpdateConfigRequest},
        error::ConfigServiceError,
        repository,
    },
    pagination::{PaginatedResponse, Pagination},
};

// Create

pub async fn create_config(
    db: &PgPool,
    request: CreateConfigRequest,
) -> Result<ConfigResponse, ConfigServiceError> {
    let config = repository::create_config(
        db,
        &request.slug,
        &request.label,
        &request.icon,
        &request.path,
        request.position,
        request.visible,
    )
    .await?;

    Ok(config.into())
}

// Read

pub async fn get_config(db: &PgPool, id: Uuid) -> Result<ConfigResponse, ConfigServiceError> {
    let config = repository::find_config_by_id(db, id).await?;

    Ok(config.into())
}

pub async fn list_configs(
    db: &PgPool,
    query: ListConfigsQuery,
) -> Result<PaginatedResponse<ConfigResponse>, ConfigServiceError> {
    let pagination = Pagination::new(query.page, query.page_size);
    let filters = repository::ConfigListFilters::from(query);

    let total = repository::count_configs(db, &filters).await?;
    let configs = repository::list_configs(db, pagination, &filters).await?;
    let items = configs.into_iter().map(ConfigResponse::from).collect();

    Ok(PaginatedResponse::new(items, pagination, total))
}

// Update

pub async fn update_config(
    db: &PgPool,
    id: Uuid,
    request: UpdateConfigRequest,
) -> Result<ConfigResponse, ConfigServiceError> {
    let config = repository::update_config_by_id(
        db,
        id,
        request.slug.as_deref(),
        request.label.as_deref(),
        request.icon.as_deref(),
        request.path.as_deref(),
        request.position,
        request.visible,
    )
    .await?;

    Ok(config.into())
}

// Delete

pub async fn delete_config(db: &PgPool, id: Uuid) -> Result<(), ConfigServiceError> {
    repository::delete_config_by_id(db, id).await?;

    Ok(())
}
