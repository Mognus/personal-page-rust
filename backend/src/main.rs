mod app;
mod config;
mod db;
mod health;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {
    let config = config::Config::from_env();
    let db = db::connect(&config.database_url)
        .await
        .expect("failed to connect to database");
    let state = AppState { db };
    let app = app::router(state);

    let address = format!("{}:{}", config.server_host, config.server_port);
    let listener = tokio::net::TcpListener::bind(&address)
        .await
        .expect("failed to bind backend server");

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}
