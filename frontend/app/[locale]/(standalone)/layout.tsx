// Standalone layout: no app shell (sidebar/header). For full-page screens like
// login. Keeps the full-height chain so children can use min-h-full.
export default function StandaloneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="h-full">{children}</div>;
}
