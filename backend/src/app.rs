use axum::Router;

use crate::{health, state::AppState, users};

pub fn router(state: AppState) -> Router {
    Router::new()
        .merge(health::routes())
        .nest("/users", users::routes())
        .with_state(state)
}
