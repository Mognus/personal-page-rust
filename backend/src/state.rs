use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub jwt_expires_in_seconds: i64,
    pub jwt_secret: String,
}
