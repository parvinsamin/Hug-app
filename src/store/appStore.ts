import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Locale type
export interface LocaleState {
    country: string;
    language: string;
    direction: "ltr" | "rtl";
}

// MAIN STORE TYPE
export interface AppState {
    deviceId?: string;
    token?: string;
    locale: LocaleState;

    setDeviceId: (id: string) => void;
    setToken: (token: string) => void;
    setLocale: (locale: LocaleState) => void;
}

// STORE IMPLEMENTATION
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            deviceId: undefined,
            token: undefined,

            locale: {
                country: "us",
                language: "en",
                direction: "ltr",
            },

            setDeviceId: (id) => set({ deviceId: id }),
            setToken: (token) => set({ token }),
            setLocale: (locale) => set({ locale }),
        }),
        {
            name: "hug_app_storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
