use std::{env, fs};

use sqlx::PgPool;

const DEFAULT_DATABASE_URL: &str = "postgres://personal_page:personal_page@localhost:5432/personal_page";

// (slug, full_name, label, position). The enso angle is derived from position
// in the frontend, so we only seed the order here, not a literal angle.
const SEED_PROJECTS: &[(&str, &str, &str, i32)] = &[
    ("dotfiles", "Mognus/linux-dotfiles", "Dotfiles", 0),
    ("personal-blog", "Mognus/personal-blog", "Personal Blog", 1),
    ("auth-service", "Mognus/auth-service", "Auth Service", 2),
];

#[tokio::main]
async fn main() {
    let database_url = database_url();
    let db = PgPool::connect(&database_url)
        .await
        .expect("failed to connect to database");

    for (slug, full_name, label, position) in SEED_PROJECTS {
        sqlx::query(
            r#"
            INSERT INTO projects (slug, full_name, label, position)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (slug) DO UPDATE
            SET
                full_name = EXCLUDED.full_name,
                label = EXCLUDED.label,
                position = EXCLUDED.position,
                updated_at = now()
            "#,
        )
        .bind(slug)
        .bind(full_name)
        .bind(label)
        .bind(position)
        .execute(&db)
        .await
        .expect("failed to seed project");

        println!("seeded {slug} -> {full_name}");
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
