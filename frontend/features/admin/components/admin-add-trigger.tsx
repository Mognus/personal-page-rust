"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AdminForm } from "@/features/admin/components/admin-form";
import type { AdminSchema } from "@/features/admin/lib/types";

interface AdminAddTriggerProps {
    resource: string;
    schema: AdminSchema;
}

export function AdminAddTrigger({ resource, schema }: AdminAddTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
            <SheetTrigger
                render={
                    <Button variant="outline" className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        New
                    </Button>
                }
            />
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-syne tracking-[0.15em] uppercase">
                        New {schema.displayName}
                    </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto p-4">
                    <AdminForm
                        resource={resource}
                        schema={schema}
                        mode="create"
                        onDone={() => setOpen(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
