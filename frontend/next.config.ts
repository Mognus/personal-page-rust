import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    output: "standalone",
    // Keep the native canvas binding out of Turbopack's server bundle.
    serverExternalPackages: ["@napi-rs/canvas"],
};

export default withNextIntl(nextConfig);
