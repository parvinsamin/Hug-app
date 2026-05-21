// src/components/ListingCard.tsx
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { Bookmark } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─── Mock attributes pool — replace with API data later ──────────────────────
const ATTR_POOL = [
    'بدون اتاق', '۱۵۰۰۰متر', 'اجاره', 'آپارتمان',
    'ودیعه', '۲ اتاق', '۸۰ متر', 'نوساز', 'تعداد اتاق',
];

// Stable random attrs per item id — 2 to 3 chips
function getMockAttrs(id: number): string[] {
    const count = (id % 2) + 2;
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(ATTR_POOL[(id * (i + 7)) % ATTR_POOL.length]);
    }
    return result;
}

interface ListingCardProps {
    id?: number;
    title?: string;
    image?: string;
    location?: string;
    timeAgo?: string;
    rooms?: string;
    area?: number;
    capacity?: number;
    rent?: string;
    deposit?: string;
    category?: string;
    distance?: number;
    photoCount?: number;
    badge?: 'gold' | 'special';
    mirrored?: boolean;
    onPress?: () => void;
    onBookmark?: () => void;
}

export default function ListingCard({
    id = 0,
    title = '',
    image,
    location = '',
    timeAgo = '',
    rooms,
    area,
    capacity,
    rent,
    deposit,
    category,
    distance,
    photoCount,
    badge,
    mirrored = false,
    onPress,
    onBookmark,
}: ListingCardProps) {
    const { t } = useTranslation();

    // Use API chips if available, else mock
    const chips: string[] = rooms || area
        ? [
            rooms && rooms !== '' ? rooms : null,
            area && area > 0 ? t('ads.area', { value: area }) : null,
        ].filter(Boolean) as string[]
        : getMockAttrs(id);

    const imageBlock = (
        <View style={styles.imageWrapper}>
            {image ? (
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.imagePlaceholder]} />
            )}
            {photoCount !== undefined && photoCount > 0 && (
                <View style={styles.photoCountBadge}>
                    <Text style={styles.photoCountText}>{photoCount} 📷</Text>
                </View>
            )}
        </View>
    );

    const textBlock = (
        <View style={styles.textBlock}>
            {/* Bookmark */}
            <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={onBookmark}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Bookmark size={18} color={colors.muted} strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>{title}</Text>

            {/* Attribute chips */}
            {chips.length > 0 && (
                <View style={styles.chipsRow}>
                    {chips.map((chip, i) => (
                        <View key={i} style={styles.chip}>
                            <Text style={styles.chipText}>{chip}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Location */}
            {location !== '' && (
                <Text style={styles.location} numberOfLines={1}>{location}</Text>
            )}

            {/* Time */}
            {timeAgo !== '' && (
                <Text style={styles.timeAgo}>{timeAgo}</Text>
            )}
        </View>
    );

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.75}
        >
            {/* Main row */}
            <View style={[styles.mainRow, mirrored && styles.mainRowMirrored]}>
                {imageBlock}
                {textBlock}
            </View>

            {/* Price row */}
            {(rent || deposit || capacity) && (
                <View style={styles.priceRow}>
                    {rent ? (
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>{t('ads.rent')}: </Text>
                            <Text style={styles.priceValue}>{rent}</Text>
                        </View>
                    ) : <View />}
                    <View style={styles.priceDivider} />
                    {capacity && capacity > 0 ? (
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>تعداد: </Text>
                            <Text style={styles.priceValue}>{capacity} نفر ثابت</Text>
                        </View>
                    ) : deposit ? (
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>{t('ads.deposit')}: </Text>
                            <Text style={styles.priceValue}>{deposit}</Text>
                        </View>
                    ) : <View />}
                </View>
            )}

            {/* Badge */}
            {badge && (
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, badge === 'gold' ? styles.badgeGold : styles.badgeSpecial]}>
                        <Text style={[styles.badgeText, badge === 'gold' ? styles.badgeTextGold : styles.badgeTextSpecial]}>
                            {badge === 'gold' ? t('ads.gold') : t('ads.special')}
                        </Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

const IMAGE_SIZE = 110;

const styles = StyleSheet.create({
    // White card, no border, no shadow — gray background between cards creates separation
    card: {
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 0,
        marginBottom: 8, // gray gap between cards
    },

    mainRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    mainRowMirrored: {
        flexDirection: 'row-reverse',
    },

    imageWrapper: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: colors.border,
    },
    photoCountBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    photoCountText: {
        fontFamily: fonts.regular,
        fontSize: 11,
        color: '#fff',
    },

    textBlock: {
        flex: 1,
        alignItems: 'flex-end',
    },
    bookmarkButton: {
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: colors.text,
        textAlign: 'right',
        lineHeight: 22,
        marginBottom: 8,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 6,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        backgroundColor: colors.chip, // gray chip
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipText: {
        fontFamily: fonts.regular,
        fontSize: 11,
        color: colors.chipText,
    },
    location: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.muted,
        textAlign: 'right',
        marginBottom: 4,
    },
    timeAgo: {
        fontFamily: fonts.regular,
        fontSize: 11,
        color: colors.muted,
        textAlign: 'right',
    },

    // Price row
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    priceItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceLabel: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.muted,
    },
    priceValue: {
        fontFamily: fonts.bold,
        fontSize: 13,
        color: colors.text,
    },
    priceDivider: {
        width: 1,
        height: 18,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },

    // Badge
    badgeRow: {
        paddingBottom: 12,
        alignItems: 'flex-start',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 14,
    },
    badgeGold: {
        borderWidth: 1.5,
        borderColor: '#E8A020',
        backgroundColor: 'transparent',
    },
    badgeSpecial: {
        borderWidth: 1.5,
        borderColor: colors.accent,
        backgroundColor: 'transparent',
    },
    badgeText: {
        fontFamily: fonts.medium,
        fontSize: 12,
    },
    badgeTextGold: {
        color: '#E8A020',
    },
    badgeTextSpecial: {
        color: colors.accent,
    },
});