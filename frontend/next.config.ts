import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    output: "standalone",
    // Keep the Node PDF renderer and its native binding out of Turbopack.
    serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
    // PDF.js loads its fake worker dynamically, so Next cannot discover it
    // during standalone file tracing. Include it explicitly for the docs route.
    outputFileTracingIncludes: {
        "/api/docs/[name]": [
            "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
        ],
    },
};

export default withNextIntl(nextConfig);
