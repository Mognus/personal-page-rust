mod auth;
mod app;
mod config;
mod db;
mod error;
mod health;
mod listing;
mod pagination;
mod projects;
mod state;
mod users;

use state::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let config = config::Config::from_env();
    let db = db::connect(&config.database_url)
        .await
        .expect("failed to connect to database");
    let state = AppState {
        db,
        jwt_expires_in_seconds: config.jwt_expires_in_seconds,
        jwt_secret: config.jwt_secret.clone(),
    };
    let app = app::router(state);

    let listener = tokio::net::TcpListener::bind(&config.server_address)
        .await
        .expect("failed to bind backend server");

    tracing::info!("backend listening on {}", config.server_address);

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}
