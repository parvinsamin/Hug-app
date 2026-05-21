// src/components/Header.tsx
import { Bell, Search, Shield, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    I18nManager,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppStore } from "../store/appStore";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

interface HeaderProps {
    hugCount?: number;
    locationLabel?: string;
    onLocationPress?: () => void;
    onNotificationPress?: () => void;
    onMyHugPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    hugCount = 0,
    locationLabel,
    onLocationPress,
    onNotificationPress,
    onMyHugPress,
}) => {
    const { t } = useTranslation();
    const { setSearchTitle } = useAppStore();

    const [searchActive, setSearchActive] = useState(false);
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<TextInput>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isRTL = I18nManager.isRTL;

    useEffect(() => {
        if (searchActive) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [searchActive]);

    const openSearch = () => setSearchActive(true);

    const closeSearch = () => {
        setSearchActive(false);
        setSearchText('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSearchTitle('');
        inputRef.current?.blur();
    };

    const handleChangeText = (text: string) => {
        setSearchText(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchTitle(text);
        }, 500);
    };

    return (
        <View>
            {/* ── Main header row ── */}
            <View style={styles.container}>
                {/* Left: bell + search + divider + location */}
                <View style={styles.leftGroup}>
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        style={styles.iconButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Bell size={22} color={colors.text} strokeWidth={1.8} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openSearch}
                        style={styles.iconButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Search size={22} color={colors.text} strokeWidth={1.8} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={onLocationPress} style={styles.locationButton}>
                        <Text style={styles.locationText}>
                            {locationLabel ?? t("header.all_provinces")}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Right: logo + label + badge */}
                <TouchableOpacity style={styles.rightGroup} onPress={onMyHugPress}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {hugCount > 999 ? "999+" : hugCount}
                        </Text>
                    </View>
                    <Text style={styles.myHugText}>{t("header.my_hug")}</Text>
                    <View style={styles.logoCircle}>
                        <Shield size={20} color={colors.primary} strokeWidth={2} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* ── Search row — appears below header when active ── */}
            {searchActive && (
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        {/* × close — right side for RTL */}
                        <TouchableOpacity
                            onPress={closeSearch}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <X size={18} color={colors.muted} strokeWidth={2} />
                        </TouchableOpacity>

                        {/* Input */}
                        <TextInput
                            ref={inputRef}
                            style={[
                                styles.searchInput,
                                { textAlign: isRTL ? 'right' : 'left' }
                            ]}
                            value={searchText}
                            onChangeText={handleChangeText}
                            placeholder={t("header.search_placeholder")}
                            placeholderTextColor={colors.muted}
                            returnKeyType="search"
                            autoCorrect={false}
                            autoCapitalize="none"
                            underlineColorAndroid="transparent"
                        />

                        {/* Search icon */}
                        <Search size={18} color={colors.muted} strokeWidth={1.8} />
                    </View>
                </View>
            )}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconButton: { padding: 2 },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
        marginHorizontal: 4,
    },
    locationButton: { paddingHorizontal: 2 },
    locationText: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.text,
    },
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

    // Search row below header
    searchContainer: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: 15,
        color: colors.text,
        padding: 0,
        borderWidth: 0,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
});