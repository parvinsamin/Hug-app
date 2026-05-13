import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListingCardProps {
    title?: string;
    image?: string;
    location?: string;
    timeAgo?: string;
    rooms?: string;
    area?: number;
    capacity?: number;
    rent?: string;
    deposit?: string;
    isAdminMessage?: boolean;
    adminMessage?: string;
}

export default function ListingCard({
    title = "",
    image = "",
    location = "",
    timeAgo = "",
    rooms,
    area,
    capacity,
    rent,
    deposit,
    isAdminMessage = false,
    adminMessage = "",
}: ListingCardProps) {
    const { theme } = useTheme();

    // اگر پیام مدیریتی باشد
    if (isAdminMessage) {
        return (
            <View style={[styles.adminCard, { backgroundColor: theme.colors.primary + '10' }]}>
                <Text style={[styles.adminTitle, { color: theme.colors.primary }]}>
                    📢 {adminMessage || "پیام مدیریت"}
                </Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.background }]}>
            {/* سمت چپ: متن‌ها */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
                    {title}
                </Text>

                <Text style={[styles.location, { color: theme.colors.text + '80' }]}>
                    📍 {location}
                </Text>

                <Text style={[styles.time, { color: theme.colors.text + '60' }]}>
                    🕐 {timeAgo}
                </Text>

                {/* امکانات */}
                <View style={styles.features}>
                    {rooms && rooms !== "" && (
                        <View style={styles.featureItem}>
                            <Text style={[styles.featureText, { color: theme.colors.text }]}>
                                🛏 {rooms}
                            </Text>
                        </View>
                    )}
                    {area && area > 0 && (
                        <View style={styles.featureItem}>
                            <Text style={[styles.featureText, { color: theme.colors.text }]}>
                                📐 {area} متر
                            </Text>
                        </View>
                    )}
                    {capacity && capacity > 0 && (
                        <View style={styles.featureItem}>
                            <Text style={[styles.featureText, { color: theme.colors.text }]}>
                                👥 {capacity} نفر
                            </Text>
                        </View>
                    )}
                </View>

                {/* قیمت */}
                <View style={styles.priceContainer}>
                    {rent && rent !== "" && (
                        <Text style={[styles.rent, { color: theme.colors.primary }]}>
                            {rent} تومان
                        </Text>
                    )}
                    {deposit && deposit !== "" && (
                        <Text style={[styles.deposit, { color: theme.colors.text + '80' }]}>
                            رهن: {deposit} تومان
                        </Text>
                    )}
                </View>
            </View>

            {/* سمت راست: عکس */}
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder, { backgroundColor: theme.colors.border }]} />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flex: 2,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    location: {
        fontSize: 12,
        marginBottom: 4,
    },
    time: {
        fontSize: 11,
        marginBottom: 8,
    },
    features: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    featureItem: {
        marginRight: 12,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    rent: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 12,
    },
    deposit: {
        fontSize: 12,
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    placeholder: {
        backgroundColor: '#e0e0e0',
    },
    adminCard: {
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    adminTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
});