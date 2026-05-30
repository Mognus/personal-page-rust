use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::users::model::{User, UserRole};

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub email: String,
    pub display_name: String,
    pub password: String,
    pub role: UserRole,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserRequest {
    pub email: Option<String>,
    pub display_name: Option<String>,
    pub password: Option<String>,
    pub role: Option<UserRole>,
}

#[derive(Debug, Deserialize)]
pub struct ListUsersQuery {
    // Query params for GET /users, for example: /users?page=1&page_size=20
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

// Public HTTP shape; keep it separate from the internal User model.
#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub email: String,
    pub display_name: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}
