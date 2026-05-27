use axum::{Router, routing::get};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/health", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .expect("failed to bind backend server");

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}

async fn health_check() -> &'static str {
    "ok"
}
