import { LoginForm } from "@/features/auth/components/login-form";
import { authApi } from "@/features/auth/lib/auth-api";
import { redirect } from "@/i18n/navigation";

export default async function LoginPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Already signed in? Skip the form.
    const me = await authApi.me();
    if (me.ok) redirect({ href: "/", locale });

    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <LoginForm />
        </div>
    );
}
