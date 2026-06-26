use std::{env, fs};

use serde::Deserialize;

#[path = "../seed_support.rs"]
mod seed_support;

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

// Usage: seed_projects [--file <path>] [--clean [--yes]]
//   --clean  delete projects whose slug is no longer in the seed file
//   --yes    skip the confirmation prompt (for non-interactive runs)
#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let path =
        seed_support::flag(&args, "--file").unwrap_or_else(|| DEFAULT_SEED_FILE.to_string());

    let content = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("could not read seed file '{path}': {error}"));
    let projects: Vec<SeedProject> = serde_json::from_str(&content)
        .unwrap_or_else(|error| panic!("invalid JSON in '{path}': {error}"));

    let db = seed_support::connect().await;

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

    // --clean: prune projects the seed no longer lists.
    if seed_support::has_flag(&args, "--clean") {
        let keep: Vec<String> = projects.iter().map(|project| project.slug.clone()).collect();
        seed_support::clean_stale(&db, "projects", "slug", &keep, seed_support::has_flag(&args, "--yes"))
            .await
            .expect("failed to clean projects");
    }
}
