"use client";

import { useEffect } from "react";

// Keeps <html lang> in sync with the active locale. Needed because <html> lives
// in the root layout (which doesn't re-render on locale change).
export function LocaleSync({ locale }: { locale: string }) {
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    return null;
}
