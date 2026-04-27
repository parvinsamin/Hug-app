import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";

import { loadSplash } from "../services/splash/splash.service";
import { useAppStore } from "../store/appStore";

export function SplashScreen() {
    const locale = useAppStore(state => state.locale);
    const [data, setData] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function load() {
            const json = await loadSplash(locale.language);
            setData(json);

            I18nManager.allowRTL(locale.direction === "rtl");
            I18nManager.forceRTL(locale.direction === "rtl");

            // رفتن به Tabs بعد از نمایش کوتاه Splash
            setTimeout(() => {
                navigation.dispatch(StackActions.replace("Tabs"));
            }, 1200);
        }

        load();
    }, [locale, navigation]);

    if (!data) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.subtitle}>{data.subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: 200, height: 200 },
    title: { fontSize: 24, marginTop: 16 },
    subtitle: { fontSize: 16, marginTop: 8, opacity: 0.7 }
});
