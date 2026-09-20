use axum::{Router, middleware};

use crate::{
    auth, auth::middleware::require_admin, health, state::AppState, users,
};

pub fn router(state: AppState) -> Router {
    // route_layer applies only to the /users group, leaving /auth and /health
    // open. /users is admin-only — the real authorization boundary.
    let users = users::routes()
        .route_layer(middleware::from_fn_with_state(state.clone(), require_admin));

    Router::new()
        .merge(health::routes())
        .nest("/auth", auth::routes::routes())
        .nest("/users", users)
        .with_state(state)
}
