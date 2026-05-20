import React from "react";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

// Replace with your actual icon library, e.g. @expo/vector-icons or lucide-react-native
import { Bell, Search, Shield } from "lucide-react-native";

interface HeaderProps {
    hugCount?: number;
    /** Override the default t('header.all_provinces') label */
    locationLabel?: string;
    onLocationPress?: () => void;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
    onMyHugPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    hugCount = 0,
    locationLabel,
    onLocationPress,
    onSearchPress,
    onNotificationPress,
    onMyHugPress,
}) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>

            {/* ── Left group: bell · search | location ── */}
            <View style={styles.leftGroup}>
                <TouchableOpacity
                    onPress={onNotificationPress}
                    style={styles.iconButton}
                    accessibilityLabel={t("header.notifications")}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Bell size={22} color={colors.text} strokeWidth={1.8} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSearchPress}
                    style={styles.iconButton}
                    accessibilityLabel={t("header.search")}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Search size={22} color={colors.text} strokeWidth={1.8} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    onPress={onLocationPress}
                    style={styles.locationButton}
                    accessibilityLabel={t("header.all_provinces")}
                >
                    <Text style={styles.locationText}>
                        {locationLabel ?? t("header.all_provinces")}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Right group: logo icon · label · count badge ── */}
            <TouchableOpacity
                style={styles.rightGroup}
                onPress={onMyHugPress}
                accessibilityLabel={t("header.my_hug")}
            >
                {/* Blue pill badge with count */}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {hugCount > 999 ? "999+" : hugCount}
                    </Text>
                </View>

                {/* "هاگ من" / "My Hug" label */}
                <Text style={styles.myHugText}>{t("header.my_hug")}</Text>

                {/* Brand logo circle */}
                <View style={styles.logoCircle}>
                    <Shield size={20} color={colors.primary} strokeWidth={2} />
                </View>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        // Android elevation
        elevation: 2,
    },

    // ── Left side ─────────────────────────────────────
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconButton: {
        padding: 2,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
        marginHorizontal: 4,
    },
    locationButton: {
        paddingHorizontal: 2,
    },
    locationText: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.text,
    },

    // ── Right side ────────────────────────────────────
    rightGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        minWidth: 38,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        fontFamily: fonts.bold,
        fontSize: 13,
        color: colors.surface,
    },
    myHugText: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.text,
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primarySoft,
        alignItems: "center",
        justifyContent: "center",
    },
});