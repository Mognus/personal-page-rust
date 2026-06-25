use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::projects::model::Project;

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub slug: String,
    pub full_name: String,
    pub label: String,
    #[serde(default)]
    pub position: i32,
    #[serde(default = "default_visible")]
    pub visible: bool,
}

fn default_visible() -> bool {
    true
}

#[derive(Debug, Deserialize)]
pub struct UpdateProjectRequest {
    pub slug: Option<String>,
    pub full_name: Option<String>,
    pub label: Option<String>,
    pub position: Option<i32>,
    pub visible: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ListProjectsQuery {
    // Query params for GET /projects, e.g. /projects?page=1&page_size=20&search=blog
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub search: Option<String>,
    // The public site passes visible=true; the admin omits it to see all.
    pub visible: Option<bool>,
}

// Public HTTP shape; keep it separate from the internal Project model.
#[derive(Debug, Serialize)]
pub struct ProjectResponse {
    pub id: Uuid,
    pub slug: String,
    pub full_name: String,
    pub label: String,
    pub position: i32,
    pub visible: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<Project> for ProjectResponse {
    fn from(project: Project) -> Self {
        Self {
            id: project.id,
            slug: project.slug,
            full_name: project.full_name,
            label: project.label,
            position: project.position,
            visible: project.visible,
            created_at: project.created_at,
            updated_at: project.updated_at,
        }
    }
}
