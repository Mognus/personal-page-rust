use axum::Router;

use crate::health;

pub fn router() -> Router {
    Router::new().merge(health::routes())
}
