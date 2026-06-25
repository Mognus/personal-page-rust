use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::configs::model::Config;

#[derive(Debug, Deserialize)]
pub struct CreateConfigRequest {
    pub slug: String,
    pub label: String,
    pub icon: String,
    pub path: String,
    #[serde(default)]
    pub position: i32,
    #[serde(default = "default_visible")]
    pub visible: bool,
}

fn default_visible() -> bool {
    true
}

#[derive(Debug, Deserialize)]
pub struct UpdateConfigRequest {
    pub slug: Option<String>,
    pub label: Option<String>,
    pub icon: Option<String>,
    pub path: Option<String>,
    pub position: Option<i32>,
    pub visible: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ListConfigsQuery {
    // Query params for GET /configs, e.g. /configs?page=1&page_size=20&search=nvim
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub search: Option<String>,
    // The public site passes visible=true; the admin omits it to see all.
    pub visible: Option<bool>,
}

// Public HTTP shape; keep it separate from the internal Config model.
#[derive(Debug, Serialize)]
pub struct ConfigResponse {
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

impl From<Config> for ConfigResponse {
    fn from(config: Config) -> Self {
        Self {
            id: config.id,
            slug: config.slug,
            label: config.label,
            icon: config.icon,
            path: config.path,
            position: config.position,
            visible: config.visible,
            created_at: config.created_at,
            updated_at: config.updated_at,
        }
    }
}
