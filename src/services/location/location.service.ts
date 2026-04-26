import { t } from "@/src/translation/translator";
import * as Location from "expo-location";
import { Alert } from "react-native";
// t(key) returns the correct language string

/**
 * Checks and requests location permission.
 * Returns true if permission is granted and services are enabled.
 */
export async function checkAndRequestLocationPermission(): Promise<boolean> {
    // 1. Check if device location services are enabled
    const servicesEnabled = await Location.hasServicesEnabledAsync();

    if (!servicesEnabled) {
        Alert.alert(
            t("location.services_disabled_title"),
            t("location.services_disabled_message")
        );
        return false;
    }

    // 2. Check existing app permission
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
        return true;
    }

    // 3. Request permission if not granted
    const { status: newStatus } = await Location.requestForegroundPermissionsAsync();

    if (newStatus === "granted") {
        return true;
    }

    // 4. User denied permission
    Alert.alert(
        t("location.permission_denied_title"),
        t("location.permission_denied_message")
    );

    return false;
}
