import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { LocaleSync } from "@/components/locale-sync";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Per-locale layout: only the i18n provider. The document shell (html/body,
// fonts, theme) lives in the root app/layout.tsx so it survives locale changes.
export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    // Enables static rendering for this locale.
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <LocaleSync locale={locale} />
            {children}
        </NextIntlClientProvider>
    );
}
