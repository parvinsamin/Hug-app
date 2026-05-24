import { StackActions, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { authService } from "@/src/services/api/auth.service";
import { geoService } from "@/src/services/api/geo.service";
import { useAppStore } from "@/src/store/appStore";
import { applyDirection } from "@/src/utils/i18n-direction";

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
        console.log('❌ init:');
        // 1. check internet
        const online = await isOnline();
        if (!online) {
            await SplashScreen.hideAsync();
            navigation.dispatch(StackActions.replace("NetworkError"));
            return;
        }

        // 2. geo → language + direction
        // Since isOnline already called whereAmI, just call it again
        // (cached by the time we get here, very fast)
        try {
            const geo = await geoService.whereAmI();
            if (!geo?.data?.countryData) {
                await SplashScreen.hideAsync();
                navigation.dispatch(StackActions.replace("CountryNotSupported"));
                return;
            }
            const { lang_direction } = geo.data.countryData;
            setLocale({ country: 'ir', language: 'fa', direction: 'rtl' });
            await applyDirection(lang_direction);
        } catch {
            // If geo fails after online check passes, just use defaults and continue
            setLocale({ country: 'ir', language: 'fa', direction: 'rtl' });
            await applyDirection('rtl');
        }

        // 3. deviceId + fastRegister
        try {
            const deviceId = await getOrCreateDeviceId();
            setDeviceId(deviceId);
            await authService.fastRegister(deviceId);
        } catch {
            // non-fatal
        }

        // 4. location
        const location = await requestLocation();
        if (location) setLocation(location);

        // 5. go to app
        if (mounted.current) {
            await SplashScreen.hideAsync();
            navigation.dispatch(StackActions.replace("Splash"));
        }
    };
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0099CC" />
        </View>
    );
}
