use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::users::error::InvalidUserRole;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum UserRole {
    User,
    Friend,
    Admin,
}

impl UserRole {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::User => "user",
            Self::Friend => "friend",
            Self::Admin => "admin",
        }
    }
}

// Standard fallible conversion from persisted text into the typed role.
impl TryFrom<&str> for UserRole {
    type Error = InvalidUserRole;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "user" => Ok(Self::User),
            "friend" => Ok(Self::Friend),
            "admin" => Ok(Self::Admin),
            _ => Err(InvalidUserRole {
                value: value.to_string(),
            }),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub display_name: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
