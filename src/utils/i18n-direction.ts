import * as Updates from "expo-updates";
import { I18nManager, Platform } from "react-native";

export async function applyDirection(direction: "rtl" | "ltr") {
    const isRTL = direction === "rtl";

    if (Platform.OS === "web") {
        console.log("🌐 Web: skipping RTL management");
        return;
    }

    if (I18nManager.isRTL === isRTL) return;

    try {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        await Updates.reloadAsync();
    } catch (err) {
        console.log("⚠️ Failed to apply RTL:", err);
    }
}
