import "server-only";

import { createCanvas } from "@napi-rs/canvas";
// Legacy build: no DOM/Worker assumptions, works in a plain Node route handler.
// It auto-detects Node and rasterizes glyphs via its own @napi-rs/canvas
// binding internally — we only need to supply the final-page canvas ourselves.
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import type { DocFile } from "@/lib/docs";

// Rendered pages don't change until the PDF file on disk does (see
// DocFile.mtimeMs), so cache the PNG bytes in memory keyed by exactly what
// produced them — avoids re-rasterizing on every cube spin / viewer open.
const pageCache = new Map<string, Buffer>();
const pageCountCache = new Map<string, number>();

function cacheKey(doc: DocFile, suffix: string) {
    return `${doc.fileName}:${doc.mtimeMs}:${suffix}`;
}

export async function getPdfPageCount(doc: DocFile): Promise<number> {
    const key = cacheKey(doc, "count");
    const cached = pageCountCache.get(key);
    if (cached !== undefined) return cached;

    const loadingTask = pdfjsLib.getDocument({ data: doc.bytes });
    const pdf = await loadingTask.promise;
    const count = pdf.numPages;
    await loadingTask.destroy();
    pageCountCache.set(key, count);
    return count;
}

// Renders one PDF page to PNG bytes at the given scale (1 = 72dpi CSS pixels).
export async function renderPdfPage(
    doc: DocFile,
    pageNumber: number,
    scale: number,
): Promise<Buffer> {
    const key = cacheKey(doc, `${pageNumber}@${scale}`);
    const cached = pageCache.get(key);
    if (cached) return cached;

    const loadingTask = pdfjsLib.getDocument({ data: doc.bytes });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    // pdfjs's DOM types don't line up 1:1 with @napi-rs/canvas's; per its own
    // docs, passing `canvas: null` alongside `canvasContext` is the supported
    // "use my own context" path, just not typed for non-DOM canvases.
    await page.render({
        canvas: null,
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
    }).promise;

    const png = canvas.toBuffer("image/png");
    await loadingTask.destroy();

    pageCache.set(key, png);
    return png;
}
