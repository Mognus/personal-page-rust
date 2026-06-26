use std::{env, fs};

use serde::Deserialize;
use sqlx::PgPool;

const DEFAULT_DATABASE_URL: &str = "postgres://personal_page:personal_page@localhost:5432/personal_page";
const DEFAULT_SEED_FILE: &str = "seeds/configs.json";

// One config entry from the seed file (see seeds/configs.json.example). The data
// lives off-repo; pass --file <path> (prod mounts it into the container). icon
// is a lucide name resolved client-side.
#[derive(Debug, Deserialize)]
struct SeedConfig {
    slug: String,
    label: String,
    icon: String,
    path: String,
    #[serde(default)]
    position: i32,
}

#[tokio::main]
async fn main() {
    let path = seed_file_path();
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("could not read seed file '{path}': {error}"));
    let configs: Vec<SeedConfig> = serde_json::from_str(&content)
        .unwrap_or_else(|error| panic!("invalid JSON in '{path}': {error}"));

    let db = PgPool::connect(&database_url())
        .await
        .expect("failed to connect to database");

    for config in &configs {
        sqlx::query(
            r#"
            INSERT INTO configs (slug, label, icon, path, position)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (slug) DO UPDATE
            SET
                label = EXCLUDED.label,
                icon = EXCLUDED.icon,
                path = EXCLUDED.path,
                position = EXCLUDED.position,
                updated_at = now()
            "#,
        )
        .bind(&config.slug)
        .bind(&config.label)
        .bind(&config.icon)
        .bind(&config.path)
        .bind(config.position)
        .execute(&db)
        .await
        .expect("failed to seed config");

        println!("seeded {} -> {}", config.slug, config.path);
    }
}

// Path to the seed file: --file <path>, else the default relative to the cwd.
fn seed_file_path() -> String {
    let args: Vec<String> = env::args().skip(1).collect();
    flag(&args, "--file").unwrap_or_else(|| DEFAULT_SEED_FILE.to_string())
}

fn flag(args: &[String], name: &str) -> Option<String> {
    args.iter()
        .position(|arg| arg == name)
        .and_then(|index| args.get(index + 1))
        .cloned()
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
