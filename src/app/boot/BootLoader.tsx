import { StackActions, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Alert, Linking, Platform, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { authService } from "@/src/services/api/auth.service";
import { geoService } from "@/src/services/api/geo.service";
import { useAppStore } from "@/src/store/appStore";
import { applyDirection } from "@/src/utils/i18n-direction";

SplashScreen.preventAutoHideAsync();

// ─── DeviceId key ─────────────────────────────────────────────────────────────
const DEVICE_ID_KEY = "hug_device_id";

// ─── Get or create deviceId — stored separately from Zustand ─────────────────
const getOrCreateDeviceId = async (): Promise<string> => {
    // always use localStorage/sessionStorage directly — not Zustand
    // this avoids the persist middleware duplicating values
    if (Platform.OS === "web") {
        const saved = localStorage.getItem(DEVICE_ID_KEY);
        // only use if it's a valid single UUID (no commas)
        if (saved && !saved.includes(",") && saved.length < 40) {
            return saved;
        }
        // generate fresh UUID
        const newId = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, newId);
        console.log("📱 New deviceId:", newId);
        return newId;
    }

    // mobile — use AsyncStorage directly
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const saved = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (saved && !saved.includes(",") && saved.length < 40) {
        return saved;
    }
    const newId = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    console.log("📱 New deviceId:", newId);
    return newId;
};

export default function BootLoader() {
    const navigation = useNavigation();
    const { setLocale, setDeviceId, setLocation } = useAppStore();
    const mounted = useRef(true);

    useEffect(() => {
        init();
        return () => {
            mounted.current = false;
        };
    }, []);

    // ─── Check internet ──────────────────────────────────────────────────────
    const isOnline = async (): Promise<boolean> => {
        try {
            const res = await fetch("https://hugmerchant.com", { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    };

    // ─── Request location ────────────────────────────────────────────────────
    const requestLocation = async (): Promise<{ lat: number; long: number } | null> => {
        if (Platform.OS === "web") {
            if (!navigator.geolocation) {
                Alert.alert("Location Not Supported", "Your browser does not support location.");
                return null;
            }
            return new Promise((resolve) => {
                const tryGetLocation = () => {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, long: pos.coords.longitude }),
                        () => {
                            Alert.alert(
                                "Location Required",
                                "Please allow location in your browser, then press Try Again.",
                                [
                                    { text: "Try Again", onPress: () => tryGetLocation() },
                                    { text: "Skip", style: "cancel", onPress: () => resolve(null) },
                                ]
                            );
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                };
                tryGetLocation();
            });
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Location Required",
                "Please enable location to see ads near you.",
                [
                    { text: "Open Settings", onPress: () => Linking.openSettings() },
                    { text: "Cancel", style: "cancel" },
                ]
            );
            return null;
        }
        const loc = await Location.getCurrentPositionAsync({});
        return { lat: loc.coords.latitude, long: loc.coords.longitude };
    };

    // ─── Main boot ───────────────────────────────────────────────────────────
    const init = async () => {
        console.log("🚀 Boot start");

        // 1. check internet
        const online = await isOnline();
        if (!online) {
            await SplashScreen.hideAsync();
            navigation.dispatch(StackActions.replace("NetworkError"));
            return;
        }

        // 2. geo → language + direction
        try {
            const geo = await geoService.whereAmI();
            if (!geo?.data?.countryData) {
                await SplashScreen.hideAsync();
                navigation.dispatch(StackActions.replace("CountryNotSupported"));
                return;
            }
            const { code, lang_code, lang_direction } = geo.data.countryData;
            setLocale({ country: code, language: lang_code, direction: lang_direction });
            await applyDirection(lang_direction);
        } catch (error) {
            console.log("❌ Geo error:", error);
            await SplashScreen.hideAsync();
            navigation.dispatch(StackActions.replace("NetworkError"));
            return;
        }

        // 3. get clean deviceId + fastRegister
        try {
            const deviceId = await getOrCreateDeviceId();

            // ✅ save clean deviceId to store
            setDeviceId(deviceId);
            console.log("📱 DeviceId:", deviceId);

            // register device with server
            const authRes = await authService.fastRegister(deviceId);
            console.log("🔑 fastRegister:", authRes.result, authRes.message);

        } catch (error) {
            console.log("❌ Auth error:", error);
            // non-fatal
        }

        // 4. location
        const location = await requestLocation();
        if (location) {
            setLocation(location);
            console.log("📍 Location:", location);
        }

        // 5. go to splash
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