use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub server_host: String,
    pub server_port: u16,
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
        let server_port = env::var("SERVER_PORT")
            .ok()
            .and_then(|value| value.parse().ok())
            .unwrap_or(8080);

        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://personal_page:personal_page@localhost:5432/personal_page".to_string()
        });

        Self {
            server_host,
            server_port,
            database_url,
        }
    }
}
