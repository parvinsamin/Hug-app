import { StackActions, useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

import { geoService } from "@/src/services/api/geo.service";
import { useAppStore } from "@/src/store/appStore";
import { applyDirection } from "@/src/utils/i18n-direction";

// ✅ جلوگیری از auto hide شدن اسپلش
SplashScreen.preventAutoHideAsync();

export default function BootLoader() {
    const navigation = useNavigation();
    const setLocale = useAppStore((s) => s.setLocale);
    const mounted = useRef(true);

    useEffect(() => {
        init();

        return () => {
            mounted.current = false;
        };
    }, []);

    const isOnline = async () => {
        try {
            const res = await fetch("https://hugmerchant.com", { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    };

    const init = useCallback(async () => {
        console.log("🚀 Boot start");

        const online = await isOnline();
        console.log("🌐 Online:", online);

        if (!online) {
            if (mounted.current) {
                await SplashScreen.hideAsync();
                navigation.dispatch(StackActions.replace("NetworkError"));
            }
            return;
        }

        try {
            const geo = await geoService.whereAmI();
            console.log("🌍 GEO:", geo);

            if (!geo?.data?.countryData) {
                if (mounted.current) {
                    await SplashScreen.hideAsync();
                    navigation.dispatch(
                        StackActions.replace("CountryNotSupported")
                    );
                }
                return;
            }

            const { code, lang_code, lang_direction } =
                geo.data.countryData;

            // ✅ set locale in zustand
            setLocale({
                country: code,
                language: lang_code,
                direction: lang_direction,
            });

            // ✅ apply RTL/LTR
            await applyDirection(lang_direction);

            if (mounted.current) {
                await SplashScreen.hideAsync();
                navigation.dispatch(StackActions.replace("Splash"));
            }
        } catch (error) {
            console.log("❌ Boot error:", error);

            if (mounted.current) {
                await SplashScreen.hideAsync();
                navigation.dispatch(StackActions.replace("NetworkError"));
            }
        }
    }, [navigation, setLocale]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size="large" color="#555" />
        </View>
    );
}
