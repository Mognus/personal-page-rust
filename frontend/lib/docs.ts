import "server-only";

import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Whitelist: doc key → filename in the docs dir. The path is built ONLY from
// this registry, never from the raw param — that blocks directory traversal.
const DOCS: Record<string, string> = {
    cv: "magnus-lebenslauf.pdf",
    zeugnisse: "magnus-zeugnisse.pdf",
    abilities: "magnus-abilities.pdf",
};

// Docs live outside public/. In prod, mount the folder and set DOCS_DIR.
const DOCS_DIR = process.env.DOCS_DIR ?? "private";

export type DocFile = {
    fileName: string;
    bytes: Buffer;
    // Cache key for rendered pages: bumps automatically if the PDF on disk
    // changes, without needing an explicit cache-invalidation step.
    mtimeMs: number;
};

// Loads a whitelisted doc by key, or null if the key/file doesn't exist.
export async function loadDoc(name: string): Promise<DocFile | null> {
    const fileName = DOCS[name];
    if (!fileName) return null;

    const filePath = path.resolve(process.cwd(), DOCS_DIR, fileName);
    try {
        const [bytes, stats] = await Promise.all([
            readFile(filePath),
            stat(filePath),
        ]);
        return { fileName, bytes, mtimeMs: stats.mtimeMs };
    } catch {
        return null;
    }
}
