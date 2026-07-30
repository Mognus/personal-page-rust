import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    output: "standalone",
    // Keep the Node PDF renderer and its native binding out of Turbopack.
    serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
};

export default withNextIntl(nextConfig);
