import { readFile } from "node:fs/promises";
import path from "node:path";

import { authApi } from "@/features/auth/lib/auth-api";

// Whitelist: doc key → filename in the docs dir. The path is built ONLY from
// this registry, never from the raw param — that blocks directory traversal.
const DOCS: Record<string, string> = {
    cv: "magnus-lebenslauf.pdf",
    zeugnisse: "magnus-zeugnisse.pdf",
    abilities: "magnus-abilities.pdf",
};

// Docs live outside public/. In prod, mount the folder and set DOCS_DIR.
const DOCS_DIR = process.env.DOCS_DIR ?? "private";

// Auth-gated document download: verifies the session against the backend, then
// streams a whitelisted file. A direct URL hit without a valid session gets 401.
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ name: string }> },
) {
    const me = await authApi.me();
    if (!me.ok) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await params;
    const fileName = DOCS[name];
    if (!fileName) {
        return new Response("Not found", { status: 404 });
    }

    try {
        const bytes = await readFile(
            path.resolve(process.cwd(), DOCS_DIR, fileName),
        );
        return new Response(new Uint8Array(bytes), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${fileName}"`,
                "Cache-Control": "private, no-store",
            },
        });
    } catch {
        return new Response("Document not available", { status: 404 });
    }
}
