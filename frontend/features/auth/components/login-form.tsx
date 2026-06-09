"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginInput } from "@/features/auth/lib/schema";

export function LoginForm() {
    const router = useRouter();
    const t = useTranslations("Login");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({ resolver: standardSchemaResolver(loginSchema) });

    async function onSubmit(values: LoginInput) {
        const result = await loginAction(values);
        // The action returns a result object; the UI just reacts + toasts.
        // The server's error string is a fallback — the displayed message is
        // localized here, keyed off the status (401 = bad credentials).
        if (!result.ok) {
            toast.error(result.status === 401 ? t("invalid") : t("error"));
            return;
        }
        toast.success(t("welcome", { name: result.data.display_name }));
        router.push("/");
        router.refresh();
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                    noValidate
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">{t("password")}</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2"
                    >
                        {isSubmitting ? t("submitting") : t("submit")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
