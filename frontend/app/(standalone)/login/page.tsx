import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { authApi } from "@/features/auth/lib/auth-api";

export default async function LoginPage() {
    // Already signed in? Skip the form.
    const me = await authApi.me();
    if (me.ok) redirect("/");

    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <LoginForm />
        </div>
    );
}
