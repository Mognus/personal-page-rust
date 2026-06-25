"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRecord, updateRecord } from "@/features/admin/actions";
import type {
    AdminField,
    AdminRecord,
    AdminSchema,
} from "@/features/admin/lib/types";
import { useRouter } from "@/i18n/navigation";

// Values are typed per field (boolean/number/string) so the JSON payload
// matches what the backend deserializes — not everything-as-string.
type Values = Record<string, unknown>;

interface AdminFormProps {
    resource: string;
    schema: AdminSchema;
    mode: "create" | "edit";
    record?: AdminRecord;
    onDone: () => void;
}

function visibleFields(
    schema: AdminSchema,
    mode: "create" | "edit",
): AdminField[] {
    return schema.fields.filter(
        (f) =>
            !f.readonly && !(mode === "create" ? f.createHidden : f.editHidden),
    );
}

export function AdminForm({
    resource,
    schema,
    mode,
    record,
    onDone,
}: AdminFormProps) {
    const router = useRouter();
    const fields = visibleFields(schema, mode);

    const defaultValues: Values = Object.fromEntries(
        fields.map((f) => {
            // Normalize a persisted value to the input's type so edits round-trip.
            const v = record?.[f.name];
            if (v !== undefined && v !== null) {
                if (f.type === "boolean") return [f.name, Boolean(v)];
                if (f.type === "number") return [f.name, Number(v)];
                return [f.name, String(v)];
            }
            if (f.default !== undefined) return [f.name, f.default];
            if (f.type === "boolean") return [f.name, false];
            if (f.type === "number") return [f.name, ""];
            if (f.type === "enum") return [f.name, f.options?.[0]?.value ?? ""];
            return [f.name, ""];
        }),
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ defaultValues });

    async function onSubmit(values: Values) {
        const result =
            mode === "create"
                ? await createRecord(resource, values)
                : await updateRecord(resource, String(record?.id), values);

        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success(mode === "create" ? "Created." : "Saved.");
        onDone();
        router.refresh();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
        >
            {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "enum" ? (
                        <select
                            id={field.name}
                            {...register(field.name, {
                                required: field.required,
                            })}
                            className="h-8 border border-input bg-background px-2 text-sm focus:outline-none"
                        >
                            {field.options?.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === "boolean" ? (
                        <input
                            id={field.name}
                            type="checkbox"
                            {...register(field.name)}
                            className="h-4 w-4 self-start border border-input bg-background"
                        />
                    ) : (
                        <Input
                            id={field.name}
                            type={
                                field.type === "number"
                                    ? "number"
                                    : field.name === "password"
                                      ? "password"
                                      : "text"
                            }
                            autoComplete={
                                field.name === "password"
                                    ? "new-password"
                                    : "off"
                            }
                            {...register(field.name, {
                                required: field.required,
                                // Send a real number, not the input's string.
                                valueAsNumber: field.type === "number",
                            })}
                        />
                    )}
                    {errors[field.name] && (
                        <p className="text-sm text-destructive">Required.</p>
                    )}
                </div>
            ))}

            <Button type="submit" disabled={isSubmitting} className="mt-2">
                {isSubmitting
                    ? "Saving…"
                    : mode === "create"
                      ? "Create"
                      : "Save"}
            </Button>
        </form>
    );
}
