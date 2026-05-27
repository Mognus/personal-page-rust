use axum::{Router, extract::State, routing::get};

use crate::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/health", get(health_check))
}

async fn health_check(State(_state): State<AppState>) -> &'static str {
    "ok"
}
