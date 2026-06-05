import { create } from "zustand";

interface SettingsPanelStore {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}

// Pure client-side UI state (panel open/closed) — a module-global store is fine
// here; there's no per-request/server data to leak.
export const useSettingsPanel = create<SettingsPanelStore>((set) => ({
    isOpen: false,
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    close: () => set({ isOpen: false }),
}));
