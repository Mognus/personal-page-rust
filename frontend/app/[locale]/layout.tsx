import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";

import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";

// Website-wide UI font: geometric, technical, but readable. Drives --font-sans.
const spaceGrotesk = Space_Grotesk({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Display font for the sidebar brand title.
const syne = Syne({
    variable: "--font-syne",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Magnus Eschrich",
    description: "Personal website",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// With app/layout.tsx omitted, this is the root layout: it owns <html>/<body>,
// fonts, theme and the i18n provider. `lang` is the active locale natively.
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
        <html
            lang={locale}
            suppressHydrationWarning
            className={`${spaceGrotesk.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
        >
            <body className="h-full">
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
