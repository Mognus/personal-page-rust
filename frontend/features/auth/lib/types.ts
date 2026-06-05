// Mirrors the backend UserResponse (snake_case fields as serialized by serde).
export type UserRole = "user" | "friend" | "admin";

export interface User {
    id: string;
    email: string;
    display_name: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// Shape returned by the backend POST /auth/login.
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}
