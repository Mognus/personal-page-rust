import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Syne } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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

// Root layout: owns <html>/<body>, fonts, theme and the toaster. It sits above
// [locale] so it does NOT re-render on locale change — which is why the
// next-themes provider (it renders a <script>) lives here, not in [locale].
// The actual lang attribute is set per-locale by LocaleSync.
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${spaceGrotesk.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
        >
            <body className="h-full">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
