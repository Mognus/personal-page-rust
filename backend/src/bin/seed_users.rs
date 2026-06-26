use std::env;

use argon2::{
    Argon2, PasswordHasher,
    password_hash::SaltString,
};
use rand_core::OsRng;
use sqlx::PgPool;

#[path = "../seed_support.rs"]
mod seed_support;

const SEED_PASSWORD: &str = "secret-password";
const SEED_USERS: &[(&str, &str, &str)] = &[
    ("admin@example.com", "Admin", "admin"),
    ("friend@example.com", "Friend", "friend"),
    ("user@example.com", "User", "user"),
];
const ROLES: &[&str] = &["user", "friend", "admin"];

#[tokio::main]
async fn main() {
    let db = seed_support::connect().await;

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

    let email = seed_support::flag(&args, "--email")?;
    let password = seed_support::flag(&args, "--password")?;
    let display_name = seed_support::flag(&args, "--name")
        .unwrap_or_else(|| email.split('@').next().unwrap_or(&email).to_string());
    let role = seed_support::flag(&args, "--role").unwrap_or_else(|| "admin".to_string());

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

fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);

    Ok(Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string())
}
