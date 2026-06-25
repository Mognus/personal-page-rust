use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

// Internal config model. A curation pointer to a folder in the dotfiles repo
// plus presentation (label/icon); the files themselves are fetched from GitHub.
#[derive(Debug, Clone, Serialize)]
pub struct Config {
    pub id: Uuid,
    pub slug: String,
    pub label: String,
    pub icon: String,
    pub path: String,
    pub position: i32,
    pub visible: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
