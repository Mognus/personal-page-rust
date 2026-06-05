import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

// Locale-aware navigation primitives. Use these instead of next/link and
// next/navigation so internal links keep the active locale prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
