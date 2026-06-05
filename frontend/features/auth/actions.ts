"use server";

import { authApi } from "@/features/auth/lib/auth-api";
import { loginSchema } from "@/features/auth/lib/schema";
import type { User } from "@/features/auth/lib/types";
import type { ApiResult } from "@/lib/api";

// Server-action boundary so the client login form can reach the server-only
// authApi. Validates input, then hands off — the form reads the ApiResult.
export async function loginAction(input: unknown): Promise<ApiResult<User>> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: "Please enter a valid email and password." };
    }

    return authApi.login(parsed.data);
}

export async function logoutAction(): Promise<void> {
    await authApi.logout();
}
