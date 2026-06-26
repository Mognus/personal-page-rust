use std::{env, fs};

use serde::Deserialize;
use sqlx::PgPool;

const DEFAULT_DATABASE_URL: &str = "postgres://personal_page:personal_page@localhost:5432/personal_page";
const DEFAULT_SEED_FILE: &str = "seeds/projects.json";

// One project entry from the seed file (see seeds/projects.json.example). The
// data lives off-repo; pass --file <path> (prod mounts it into the container).
#[derive(Debug, Deserialize)]
struct SeedProject {
    slug: String,
    full_name: String,
    label: String,
    #[serde(default)]
    position: i32,
}

#[tokio::main]
async fn main() {
    let path = seed_file_path();
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("could not read seed file '{path}': {error}"));
    let projects: Vec<SeedProject> = serde_json::from_str(&content)
        .unwrap_or_else(|error| panic!("invalid JSON in '{path}': {error}"));

    let db = PgPool::connect(&database_url())
        .await
        .expect("failed to connect to database");

    for project in &projects {
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
        .bind(&project.slug)
        .bind(&project.full_name)
        .bind(&project.label)
        .bind(project.position)
        .execute(&db)
        .await
        .expect("failed to seed project");

        println!("seeded {} -> {}", project.slug, project.full_name);
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
