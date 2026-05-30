use axum::Router;

use crate::{auth, health, state::AppState, users};

pub fn router(state: AppState) -> Router {
    Router::new()
        .merge(health::routes())
        .nest("/auth", auth::routes::routes())
        .nest("/users", users::routes())
        .with_state(state)
}
