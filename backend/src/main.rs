mod app;
mod config;
mod db;
mod error;
mod health;
mod pagination;
mod state;
mod users;

use state::AppState;

#[tokio::main]
async fn main() {
    let config = config::Config::from_env();
    let db = db::connect(&config.database_url)
        .await
        .expect("failed to connect to database");
    let state = AppState { db };
    let app = app::router(state);

    let listener = tokio::net::TcpListener::bind(&config.server_address)
        .await
        .expect("failed to bind backend server");

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}
