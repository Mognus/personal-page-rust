use std::{env, fs};

use serde::Deserialize;

#[path = "../seed_support.rs"]
mod seed_support;

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

// Usage: seed_configs [--file <path>] [--clean [--yes]]
//   --clean  delete configs whose slug is no longer in the seed file
//   --yes    skip the confirmation prompt (for non-interactive runs)
#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let path =
        seed_support::flag(&args, "--file").unwrap_or_else(|| DEFAULT_SEED_FILE.to_string());

    let content = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("could not read seed file '{path}': {error}"));
    let configs: Vec<SeedConfig> = serde_json::from_str(&content)
        .unwrap_or_else(|error| panic!("invalid JSON in '{path}': {error}"));

    let db = seed_support::connect().await;

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

    // --clean: prune configs the seed no longer lists (e.g. a removed dotfile).
    if seed_support::has_flag(&args, "--clean") {
        let keep: Vec<String> = configs.iter().map(|config| config.slug.clone()).collect();
        seed_support::clean_stale(&db, "configs", "slug", &keep, seed_support::has_flag(&args, "--yes"))
            .await
            .expect("failed to clean configs");
    }
}
