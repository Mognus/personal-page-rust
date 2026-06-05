import { cookies } from "next/headers";

// Server-only base URL of the Rust backend (no NEXT_PUBLIC_ prefix).
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

// Name of the httpOnly cookie holding the backend JWT.
export const ACCESS_TOKEN_COOKIE = "access_token";

// Thrown for any non-2xx response so callers can try/catch and map the status
// to a user-facing message. `body` holds the parsed error payload if any.
export class ApiError extends Error {
    constructor(
        public status: number,
        public body?: unknown,
    ) {
        super(`API request failed with status ${status}`);
        this.name = "ApiError";
    }
}

// Result shape the domain APIs (authApi, later usersApi) return. The UI checks
// `ok` and shows `error` (e.g. via a toast) — no try/catch needed at the edge.
export type ApiResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string; status?: number };

interface CallApiOptions {
    method?: string;
    body?: unknown;
    // Attach the bearer token from the httpOnly cookie (default true).
    auth?: boolean;
}

// Server-side fetch wrapper against the backend. Reads the auth cookie, attaches
// the bearer token, and throws ApiError on any non-2xx response (HTTP errors
// included) so the caller decides how to surface them.
export async function callApi<T>(
    path: string,
    options: CallApiOptions = {},
): Promise<T> {
    const { method = "GET", body, auth = true } = options;

    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    if (auth) {
        const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => undefined);
        throw new ApiError(res.status, errorBody);
    }

    // 204 No Content has nothing to parse.
    if (res.status === 204) return undefined as T;
    return res.json();
}
