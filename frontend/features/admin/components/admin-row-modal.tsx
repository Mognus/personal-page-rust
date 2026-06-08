"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { deleteRecord } from "@/features/admin/actions";
import { AdminForm } from "@/features/admin/components/admin-form";
import type { AdminRecord, AdminSchema } from "@/features/admin/lib/types";
import { useRouter } from "@/i18n/navigation";

interface AdminRowModalProps {
    resource: string;
    schema: AdminSchema;
    row: AdminRecord;
    onClose: () => void;
}

export function AdminRowModal({
    resource,
    schema,
    row,
    onClose,
}: AdminRowModalProps) {
    const router = useRouter();

    async function handleDelete() {
        const result = await deleteRecord(resource, String(row.id));
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Deleted.");
        onClose();
        router.refresh();
    }

    return (
        <Sheet
            open
            onOpenChange={(o) => {
                if (!o) onClose();
            }}
        >
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-syne tracking-[0.15em] uppercase">
                        Edit {schema.displayName}
                    </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto p-4">
                    <AdminForm
                        resource={resource}
                        schema={schema}
                        mode="edit"
                        record={row}
                        onDone={onClose}
                    />
                </div>
                <SheetFooter>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="gap-1.5"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
