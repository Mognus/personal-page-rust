import { ConfigEmptyState } from "@/features/setup/components/file-view/config-empty-state";

// Config open but no file selected yet: prompt to pick one from the selector.
export default function ConfigPage() {
    return <ConfigEmptyState />;
}
