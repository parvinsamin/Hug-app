import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { colors } from "../theme/colors";
import { rowDirection } from "../utils/rtl";
import AppText from "./AppText";

type Props = {
    title: string;
    location: string;
    time: string;
    price?: string;
    rent?: string;
    image: any;
    featured?: boolean;
    badge?: string;
};

export default function ListingCard({
    title,
    location,
    time,
    price,
    rent,
    image,
    featured,
    badge,
}: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Pressable style={styles.bookmark} />
                <AppText variant="subtitle" bold style={styles.title}>
                    {title}
                </AppText>
            </View>

            <View style={[styles.contentRow, { flexDirection: rowDirection }]}>
                <Image source={image} style={styles.image} />

                <View style={styles.info}>
                    <View style={styles.chipsRow}>
                        <View style={styles.chip}><AppText variant="small" style={styles.chipText}>بدون اتاق</AppText></View>
                        <View style={styles.chip}><AppText variant="small" style={styles.chipText}>بدون اتاق</AppText></View>
                        <View style={styles.chip}><AppText variant="small" style={styles.chipText}>۱۵۰۰۰ متر</AppText></View>
                    </View>

                    <AppText variant="caption" style={styles.location}>
                        {location}
                    </AppText>

                    <View style={styles.bottomInfo}>
                        <AppText variant="caption" style={styles.time}>{time}</AppText>
                        {price ? <AppText variant="caption" bold style={styles.price}>اجاره: {price}</AppText> : null}
                        {rent ? <AppText variant="caption" bold style={styles.price}>ودیعه: {rent}</AppText> : null}
                    </View>

                    {badge ? (
                        <View style={styles.badge}>
                            <AppText variant="small" style={styles.badgeText}>{badge}</AppText>
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        padding: 12,
        marginBottom: 10,
    },
    topRow: {
        flexDirection: rowDirection,
        alignItems: "flex-start",
        marginBottom: 10,
    },
    bookmark: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 3,
        marginEnd: 8,
        marginTop: 2,
    },
    title: {
        flex: 1,
        color: colors.text,
        lineHeight: 24,
    },
    contentRow: {
        gap: 10,
        alignItems: "flex-start",
    },
    image: {
        width: 124,
        height: 124,
        borderRadius: 16,
        backgroundColor: "#ddd",
    },
    info: {
        flex: 1,
    },
    chipsRow: {
        flexDirection: rowDirection,
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 8,
    },
    chip: {
        backgroundColor: colors.chip,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 18,
    },
    chipText: {
        color: colors.chipText,
    },
    location: {
        color: colors.muted,
        marginBottom: 8,
    },
    bottomInfo: {
        flexDirection: rowDirection,
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    time: {
        color: colors.muted,
    },
    price: {
        color: colors.text,
    },
    badge: {
        alignSelf: "flex-start",
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        color: colors.accent,
    },
});
