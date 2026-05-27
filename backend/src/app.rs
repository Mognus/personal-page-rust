use axum::Router;

use crate::{health, state::AppState};

pub fn router(state: AppState) -> Router {
    Router::new().merge(health::routes()).with_state(state)
}
