import { cookies } from "next/headers";

import type { LoginInput } from "@/features/auth/lib/schema";
import type { LoginResponse, User } from "@/features/auth/lib/types";
import {
    ACCESS_TOKEN_COOKIE,
    ApiError,
    callApi,
    type ApiResult,
} from "@/lib/api";

// Domain auth API. callApi throws on HTTP errors; here we catch them and return
// an ApiResult with a user-facing message, so the UI just checks `ok`.
export const authApi = {
    async login(input: LoginInput): Promise<ApiResult<User>> {
        try {
            const data = await callApi<LoginResponse>("/auth/login", {
                method: "POST",
                body: input,
                auth: false,
            });

            // Store the JWT in an httpOnly cookie so client JS can never read it.
            (await cookies()).set(ACCESS_TOKEN_COOKIE, data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: data.expires_in,
            });

            return { ok: true, data: data.user };
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                return {
                    ok: false,
                    error: "Invalid email or password.",
                    status: 401,
                };
            }
            console.error("authApi.login failed", error);
            return {
                ok: false,
                error: "Something went wrong. Please try again.",
            };
        }
    },

    async logout(): Promise<void> {
        (await cookies()).delete(ACCESS_TOKEN_COOKIE);
    },

    async me(): Promise<ApiResult<User>> {
        try {
            const user = await callApi<User>("/auth/me");
            return { ok: true, data: user };
        } catch (error) {
            const status = error instanceof ApiError ? error.status : undefined;
            return { ok: false, error: "Not authenticated.", status };
        }
    },
};
