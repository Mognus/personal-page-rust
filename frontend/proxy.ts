import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

// "Middleware" was renamed to "proxy" in this Next version. Here it just runs
// the next-intl locale negotiation/redirect.
export default createMiddleware(routing);

export const config = {
    // Run on everything except API routes, Next internals and files with an
    // extension (e.g. /favicon.ico).
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
