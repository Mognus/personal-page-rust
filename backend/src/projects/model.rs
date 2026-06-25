use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

// Internal project model. The curation pointer + presentation only; live content
// (description, README, languages) is fetched from GitHub by the frontend.
#[derive(Debug, Clone, Serialize)]
pub struct Project {
    pub id: Uuid,
    pub slug: String,
    pub full_name: String,
    pub label: String,
    pub position: i32,
    pub visible: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
