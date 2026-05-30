use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub server_address: String,
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expires_in_seconds: i64,
}

impl Config {
    pub fn from_env() -> Self {
        // Keep host and port separately configurable, but expose one bind address.
        let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
        let server_port = env::var("SERVER_PORT")
            .ok()
            .and_then(|value| value.parse().ok())
            .unwrap_or(8080);
        let server_address = format!("{server_host}:{server_port}");

        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://personal_page:personal_page@localhost:5432/personal_page".to_string()
        });

        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "change_me".to_string());
        let jwt_expires_in_seconds = env::var("JWT_EXPIRES_IN_SECONDS")
            .ok()
            .and_then(|value| value.parse().ok())
            .unwrap_or(3600);

        Self {
            server_address,
            database_url,
            jwt_secret,
            jwt_expires_in_seconds,
        }
    }
}
