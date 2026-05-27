mod app;
mod config;
mod health;

#[tokio::main]
async fn main() {
    let config = config::Config::from_env();
    let app = app::router();

    let address = format!("{}:{}", config.server_host, config.server_port);
    let listener = tokio::net::TcpListener::bind(&address)
        .await
        .expect("failed to bind backend server");

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}
