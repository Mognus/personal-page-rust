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
const ROLES: &[&str] = &["user", "friend", "admin"];

#[tokio::main]
async fn main() {
    let db = PgPool::connect(&database_url())
        .await
        .expect("failed to connect to database");

    // With --email/--password: create one user with a custom password (use this
    // in prod). Without args: seed the default dev batch.
    match parse_custom_user() {
        Some(user) => {
            upsert_user(&db, &user.email, &user.display_name, &user.password, &user.role).await;
        }
        None => {
            for (email, display_name, role) in SEED_USERS {
                upsert_user(&db, email, display_name, SEED_PASSWORD, role).await;
            }
        }
    }
}

struct NewUser {
    email: String,
    display_name: String,
    password: String,
    role: String,
}

// Custom mode is active when both --email and --password are given. --name
// defaults to the local part of the email, --role to admin.
fn parse_custom_user() -> Option<NewUser> {
    let args: Vec<String> = env::args().skip(1).collect();

    let email = flag(&args, "--email")?;
    let password = flag(&args, "--password")?;
    let display_name = flag(&args, "--name")
        .unwrap_or_else(|| email.split('@').next().unwrap_or(&email).to_string());
    let role = flag(&args, "--role").unwrap_or_else(|| "admin".to_string());

    if !ROLES.contains(&role.as_str()) {
        eprintln!("invalid role '{role}' (use: {})", ROLES.join(" | "));
        std::process::exit(1);
    }

    Some(NewUser {
        email,
        display_name,
        password,
        role,
    })
}

fn flag(args: &[String], name: &str) -> Option<String> {
    args.iter()
        .position(|arg| arg == name)
        .and_then(|index| args.get(index + 1))
        .cloned()
}

async fn upsert_user(db: &PgPool, email: &str, display_name: &str, password: &str, role: &str) {
    let password_hash = hash_password(password).expect("failed to hash password");

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
    .execute(db)
    .await
    .expect("failed to seed user");

    println!("seeded {email} as {role}");
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
