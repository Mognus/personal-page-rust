import { authApi } from "@/features/auth/lib/auth-api";
import { loadDoc } from "@/lib/docs";
import { getPdfPageCount, renderPdfPage } from "@/lib/pdf-render";

// Auth-gated document access: verifies the session against the backend, then
// either streams the raw PDF (download) or, with `?page=`, a rendered PNG of
// one page (cube-face thumbnail / maximized viewer) — same gate, one file.
export async function GET(
    request: Request,
    { params }: { params: Promise<{ name: string }> },
) {
    const me = await authApi.me();
    if (!me.ok) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await params;
    const doc = await loadDoc(name);
    if (!doc) {
        return new Response("Not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    if (pageParam === null) {
        return new Response(new Uint8Array(doc.bytes), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${doc.fileName}"`,
                "Cache-Control": "private, no-store",
            },
        });
    }

    const pageNumber = Number(pageParam);
    const pageCount = await getPdfPageCount(doc);
    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > pageCount
    ) {
        return new Response("Not found", { status: 404 });
    }

    const scale = Number(searchParams.get("scale") ?? "1.5") || 1.5;
    const png = await renderPdfPage(doc, pageNumber, scale);
    return new Response(new Uint8Array(png), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "private, no-store",
            "X-Page-Count": String(pageCount),
        },
    });
}
