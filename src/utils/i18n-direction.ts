import { Alert, DevSettings, I18nManager, Platform } from "react-native";

export async function applyDirection(direction: "rtl" | "ltr") {
    const isRTL = direction === "rtl";

    if (Platform.OS === "web") {
        console.log("🌐 Web: skipping RTL management");
        return;
    }

    if (I18nManager.isRTL === isRTL) return;

    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    if (__DEV__) {
        DevSettings.reload();
    } else {
        Alert.alert("تغییر جهت", "لطفاً برنامه را ریستارت کنید.");
    }
}