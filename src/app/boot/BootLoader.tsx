import { StackActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { geoService } from "@/src/services/api/geo.service";
import { useAppStore } from "@/src/store/appStore";
import { applyDirection } from "@/src/utils/i18n-direction";

export default function BootLoader() {
    const navigation = useNavigation();
    const setLocale = useAppStore((s) => s.setLocale);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        console.log("🚀 Boot start");

        async function isOnline() {
            try {
                const res = await fetch("https://hugmerchant.com", { method: "HEAD" });
                return res.ok;
            } catch {
                return false;
            }
        }

        const online = await isOnline();
        console.log("🌐 Online:", online);

        if (!online) {
            setTimeout(() => navigation.dispatch(StackActions.replace("NetworkError")), 0);
            return;
        }

        try {
            const geo = await geoService.whereAmI();
            console.log("🌍 GEO:", geo);

            if (!geo?.data?.countryData) {
                setTimeout(() => navigation.dispatch(StackActions.replace("CountryNotSupported")), 0);
                return;
            }

            const { code, lang_code, lang_direction } = geo.data.countryData;

            setLocale({
                country: code,
                language: lang_code,
                direction: lang_direction,
            });

            await applyDirection(lang_direction);

            setTimeout(() => navigation.dispatch(StackActions.replace("Splash")), 0);
        } catch (error) {
            console.log("❌ Boot error:", error);
            setTimeout(() => navigation.dispatch(StackActions.replace("NetworkError")), 0);
        }
    }

    // 👇 لودینگ صفحه Boot
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#555" />
        </View>
    );
}
