"use server";

import { getAdminResource } from "@/features/admin/lib/resources";
import type { AdminRecord } from "@/features/admin/lib/types";
import { ApiError, callApi } from "@/lib/api";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

// Resolve the apiPath from the trusted resource registry — never trust a path
// from the client.
function apiPathFor(resource: string): string | null {
    return getAdminResource(resource)?.apiPath ?? null;
}

function toError(e: unknown): { ok: false; error: string } {
    if (e instanceof ApiError) {
        const error =
            e.status === 409
                ? "Already exists."
                : e.status === 404
                  ? "Not found."
                  : e.status === 400 || e.status === 422
                    ? "Invalid input."
                    : "Request failed.";
        return { ok: false, error };
    }
    console.error("admin action failed", e);
    return { ok: false, error: "Something went wrong." };
}

export async function createRecord(
    resource: string,
    data: AdminRecord,
): Promise<AdminActionResult> {
    const apiPath = apiPathFor(resource);
    if (!apiPath) return { ok: false, error: "Unknown resource." };
    try {
        await callApi(apiPath, { method: "POST", body: data });
        return { ok: true };
    } catch (e) {
        return toError(e);
    }
}

export async function updateRecord(
    resource: string,
    id: string,
    data: AdminRecord,
): Promise<AdminActionResult> {
    const apiPath = apiPathFor(resource);
    if (!apiPath) return { ok: false, error: "Unknown resource." };
    try {
        await callApi(`${apiPath}/${id}`, { method: "PATCH", body: data });
        return { ok: true };
    } catch (e) {
        return toError(e);
    }
}

export async function deleteRecord(
    resource: string,
    id: string,
): Promise<AdminActionResult> {
    const apiPath = apiPathFor(resource);
    if (!apiPath) return { ok: false, error: "Unknown resource." };
    try {
        await callApi(`${apiPath}/${id}`, { method: "DELETE" });
        return { ok: true };
    } catch (e) {
        return toError(e);
    }
}
