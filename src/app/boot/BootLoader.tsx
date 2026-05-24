import { StackActions, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { useAppStore } from "@/src/store/appStore";

SplashScreen.preventAutoHideAsync();

const DEVICE_ID_KEY = "hug_device_id";

const getOrCreateDeviceId = async (): Promise<string> => {
    if (Platform.OS === "web") {
        const saved = localStorage.getItem(DEVICE_ID_KEY);
        if (saved && !saved.includes(",") && saved.length < 40) return saved;
        const newId = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, newId);
        return newId;
    }

    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const saved = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (saved && !saved.includes(",") && saved.length < 40) return saved;
    const newId = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
};

export default function BootLoader() {
    const navigation = useNavigation();
    const { setLocale, setDeviceId, setLocation } = useAppStore();
    const mounted = useRef(true);

    useEffect(() => {
        init();
        return () => { mounted.current = false; };
    }, []);

    // ─── Check internet — try geo API directly, more reliable than HEAD ──────
    const isOnline = async (): Promise<boolean> => {
        try {
            console.log('🌐 Checking online...');
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                console.log('⏰ Request timed out');
                controller.abort();
            }, 8000);
            const res = await fetch("https://hugmerchant.com/api/mobile/geo/whereAmIReact", {
                method: "GET",
                signal: controller.signal,
            });
            clearTimeout(timeout);
            console.log('✅ Online check response:', res.status);
            return true;
        } catch (err) {
            console.log('❌ Online check failed:', err);
            return false;
        }
    };

    // ─── Request location ────────────────────────────────────────────────────
    const requestLocation = async (): Promise<{ lat: number; long: number } | null> => {
        if (Platform.OS === "web") {
            if (!navigator.geolocation) return null;
            return new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(null), 10000);
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        clearTimeout(timeout);
                        resolve({ lat: pos.coords.latitude, long: pos.coords.longitude });
                    },
                    () => { clearTimeout(timeout); resolve(null); },
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
                );
            });
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return null;
        try {
            const loc = await Location.getCurrentPositionAsync({});
            return { lat: loc.coords.latitude, long: loc.coords.longitude };
        } catch {
            return null;
        }
    };

    // ─── Main boot ───────────────────────────────────────────────────────────
    const init = async () => {
        alert(2)
        console.log('🚀 Boot start');

        // Safety timeout — if boot takes more than 15 seconds, go to app anyway
        const safetyTimer = setTimeout(async () => {
            console.log('⚠️ Boot timeout — forcing navigation');
            await SplashScreen.hideAsync();
            navigation.dispatch(StackActions.replace("Splash"));
        }, 15000);

        try {
            // ... rest of your init code ...

            clearTimeout(safetyTimer); // clear if boot completes normally
        } catch {
            clearTimeout(safetyTimer);
        }
    };
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0099CC" />
        </View>
    );
}
