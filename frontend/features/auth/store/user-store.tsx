"use client";

import { createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";

import type { User } from "@/features/auth/lib/types";

interface UserState {
    user: User | null;
    isAdmin: boolean;
    setUser: (user: User | null) => void;
}

type UserStore = ReturnType<typeof createUserStore>;

function createUserStore(initialUser: User | null) {
    return createStore<UserState>((set) => ({
        user: initialUser,
        isAdmin: initialUser?.role === "admin",
        setUser: (user) => set({ user, isAdmin: user?.role === "admin" }),
    }));
}

const UserStoreContext = createContext<UserStore | null>(null);

// One store per request, initialized synchronously with the server-fetched
// user — no useEffect hydration, no cross-request leak (unlike a module-global
// store), no flash. The context only carries the store.
export function UserStoreProvider({
    initialUser,
    children,
}: {
    initialUser: User | null;
    children: React.ReactNode;
}) {
    // Lazy initializer runs once → one stable store per mount (per request),
    // without touching a ref during render (keeps the React Compiler lint happy).
    const [store] = useState(() => createUserStore(initialUser));

    return (
        <UserStoreContext.Provider value={store}>
            {children}
        </UserStoreContext.Provider>
    );
}

export function useUserStore<T>(selector: (state: UserState) => T): T {
    const store = useContext(UserStoreContext);
    if (!store) {
        throw new Error("useUserStore must be used within a UserStoreProvider");
    }
    return useStore(store, selector);
}
