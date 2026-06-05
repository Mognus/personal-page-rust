import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "de"],
    defaultLocale: "en",
    // Always prefix the URL with the locale (/en/..., /de/...).
    localePrefix: "always",
});
