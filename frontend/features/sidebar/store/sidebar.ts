import { create } from "zustand";

interface SidebarStore {
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    isOpen: true,
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    setOpen: (open) => set({ isOpen: open }),
}));
