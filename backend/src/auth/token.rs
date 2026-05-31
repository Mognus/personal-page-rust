use chrono::Utc;
use jsonwebtoken::{EncodingKey, Header, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::users::model::UserRole;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub role: UserRole,
    pub exp: usize,
}

pub fn create_access_token(
    user_id: Uuid,
    role: UserRole,
    secret: &str,
    expires_in_seconds: i64,
) -> Result<String, jsonwebtoken::errors::Error> {
    let expires_at = Utc::now() + chrono::Duration::seconds(expires_in_seconds);
    let claims = Claims {
        sub: user_id,
        role,
        exp: expires_at.timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
}
