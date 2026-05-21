import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface LocaleState {
    country: string;
    language: string;
    direction: "ltr" | "rtl";
}

export interface LocationState {
    lat: number;
    long: number;
}

export interface AppState {
    deviceId?: string;
    userToken?: string;
    locale: LocaleState;
    location?: LocationState;
    searchTitle: string;
    // Store selected category ids as array (Set is not serializable)
    selectedCategoryIds: number[];

    setDeviceId: (id: string) => void;
    setUserToken: (token: string) => void;
    setLocale: (locale: LocaleState) => void;
    setLocation: (location: LocationState) => void;
    setSearchTitle: (title: string) => void;
    setSelectedCategoryIds: (ids: number[]) => void;
}

const storage = Platform.OS === "web"
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(() => AsyncStorage);

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            deviceId: undefined,
            userToken: undefined,
            location: undefined,
            searchTitle: '',
            selectedCategoryIds: [], // empty = all

            locale: {
                country: "ir",
                language: "fa-IR",
                direction: "rtl",
            },

            setDeviceId: (id) => set({ deviceId: id }),
            setUserToken: (token) => set({ userToken: token }),
            setLocale: (locale) => set({ locale }),
            setLocation: (location) => set({ location }),
            setSearchTitle: (title) => set({ searchTitle: title }),
            setSelectedCategoryIds: (ids) => set({ selectedCategoryIds: ids }),
        }),
        {
            name: "hug_app_storage",
            storage,
        }
    )
);