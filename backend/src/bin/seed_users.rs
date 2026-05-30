use std::{env, fs};

use argon2::{
    Argon2, PasswordHasher,
    password_hash::SaltString,
};
use rand_core::OsRng;
use sqlx::PgPool;

const DEFAULT_DATABASE_URL: &str = "postgres://personal_page:personal_page@localhost:5432/personal_page";
const SEED_PASSWORD: &str = "secret-password";
const SEED_USERS: &[(&str, &str, &str)] = &[
    ("admin@example.com", "Admin", "admin"),
    ("friend@example.com", "Friend", "friend"),
    ("user@example.com", "User", "user"),
];

#[tokio::main]
async fn main() {
    let database_url = database_url();
    let db = PgPool::connect(&database_url)
        .await
        .expect("failed to connect to database");

    for (email, display_name, role) in SEED_USERS {
        let password_hash = hash_password(SEED_PASSWORD).expect("failed to hash seed password");

        sqlx::query(
            r#"
            INSERT INTO users (email, display_name, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE
            SET
                display_name = EXCLUDED.display_name,
                password_hash = EXCLUDED.password_hash,
                role = EXCLUDED.role,
                updated_at = now()
            "#,
        )
        .bind(email)
        .bind(display_name)
        .bind(password_hash)
        .bind(role)
        .execute(&db)
        .await
        .expect("failed to seed user");

        println!("seeded {email} as {role}");
    }
}

fn database_url() -> String {
    env::var("DATABASE_URL")
        .ok()
        .or_else(|| database_url_from_env_file(".env"))
        .or_else(|| database_url_from_env_file("../.env"))
        .unwrap_or_else(|| DEFAULT_DATABASE_URL.to_string())
}

fn database_url_from_env_file(path: &str) -> Option<String> {
    let content = fs::read_to_string(path).ok()?;

    content.lines().find_map(|line| {
        let (key, value) = line.split_once('=')?;

        (key == "DATABASE_URL").then(|| value.trim().to_string())
    })
}

fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);

    Ok(Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string())
}
