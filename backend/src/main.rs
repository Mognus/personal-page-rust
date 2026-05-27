mod app;
mod health;

#[tokio::main]
async fn main() {
    let app = app::router();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .expect("failed to bind backend server");

    axum::serve(listener, app)
        .await
        .expect("backend server failed");
}
