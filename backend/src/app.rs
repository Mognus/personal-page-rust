use axum::{Router, middleware};

use crate::{
    auth, auth::middleware::require_admin, configs, health, projects, state::AppState, users,
};

pub fn router(state: AppState) -> Router {
    // route_layer applies only to the /users group, leaving /auth and /health
    // open. /users is admin-only — the real authorization boundary.
    let users = users::routes()
        .route_layer(middleware::from_fn_with_state(state.clone(), require_admin));

    // /projects is split: reads are public (the site lists projects without a
    // login), writes are admin-only. The admin layer wraps the write routes,
    // then both merge onto the shared paths.
    let projects = projects::read_routes().merge(
        projects::write_routes()
            .route_layer(middleware::from_fn_with_state(state.clone(), require_admin)),
    );

    // Same split as /projects: public reads, admin-only writes.
    let configs = configs::read_routes().merge(
        configs::write_routes()
            .route_layer(middleware::from_fn_with_state(state.clone(), require_admin)),
    );

    Router::new()
        .merge(health::routes())
        .nest("/auth", auth::routes::routes())
        .nest("/users", users)
        .nest("/projects", projects)
        .nest("/configs", configs)
        .with_state(state)
}
