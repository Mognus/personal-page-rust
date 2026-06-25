use std::{env, fs};

use sqlx::PgPool;

const DEFAULT_DATABASE_URL: &str = "postgres://personal_page:personal_page@localhost:5432/personal_page";

// (slug, label, icon, path, position). icon = lucide name resolved client-side.
// NOTE: keep this in sync with the actual dotfiles — e.g. Kitty replaced
// Alacritty. Adjust paths/entries here when the setup changes.
const SEED_CONFIGS: &[(&str, &str, &str, &str, i32)] = &[
    ("hyprland", "Hyprland", "Monitor", ".config/hypr", 0),
    ("waybar", "Waybar", "PanelTop", ".config/waybar", 1),
    ("kitty", "Kitty", "SquareTerminal", ".config/kitty", 2),
    ("neovim", "Neovim", "Code2", ".config/nvim", 3),
    ("shell", "Shell", "Terminal", ".config/fish", 4),
    ("notifications", "Notifications", "Bell", ".config/dunst", 5),
    ("eww", "EWW", "Layers", ".config/eww", 6),
    ("tools", "Tools", "Package", ".config/tools", 7),
];

#[tokio::main]
async fn main() {
    let database_url = database_url();
    let db = PgPool::connect(&database_url)
        .await
        .expect("failed to connect to database");

    for (slug, label, icon, path, position) in SEED_CONFIGS {
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
        .bind(slug)
        .bind(label)
        .bind(icon)
        .bind(path)
        .bind(position)
        .execute(&db)
        .await
        .expect("failed to seed config");

        println!("seeded {slug} -> {path}");
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
