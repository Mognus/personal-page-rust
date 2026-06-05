use chrono::Utc;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
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

pub fn verify_access_token(token: &str, secret: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    // Validation::default() checks the signature and rejects expired tokens (exp).
    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )?;

    Ok(data.claims)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn create_then_verify_roundtrips() {
        let secret = "test_secret";
        let user_id = Uuid::nil();

        let token = create_access_token(user_id, UserRole::Admin, secret, 3600).unwrap();
        let claims = verify_access_token(&token, secret).unwrap();

        assert_eq!(claims.sub, user_id);
        assert_eq!(claims.role, UserRole::Admin);
    }

    #[test]
    fn verify_rejects_wrong_secret() {
        let token = create_access_token(Uuid::nil(), UserRole::User, "right_secret", 3600).unwrap();

        assert!(verify_access_token(&token, "wrong_secret").is_err());
    }

    #[test]
    fn verify_rejects_expired_token() {
        let secret = "test_secret";
        // Negative lifetime puts exp in the past.
        let token = create_access_token(Uuid::nil(), UserRole::User, secret, -3600).unwrap();

        assert!(verify_access_token(&token, secret).is_err());
    }
}
