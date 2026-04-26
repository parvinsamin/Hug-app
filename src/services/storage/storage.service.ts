import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Storage keys
const DEVICE_KEY = "hug_device_id";

// --- Web / PWA Fallback ---
const webStorage = {
    getItem: async (key: string) => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },
};

// Unified API
export const storage = {
    getItem: async (key: string) => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            return await SecureStore.getItemAsync(key);
        }
        return await webStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            return await SecureStore.setItemAsync(key, value);
        }
        return await webStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            return await SecureStore.deleteItemAsync(key);
        }
        return await webStorage.removeItem(key);
    },
};
