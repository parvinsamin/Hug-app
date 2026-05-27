// src/components/FilterBar.tsx
import { CategoryNode } from '@/src/services/api/category.service';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { ChevronLeft, LayoutGrid, MapPin, SlidersHorizontal, Wifi, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryModal, { SelectedCategories } from './CategoryModal';

const MOCK_ATTRIBUTES = [
    { id: 1, label: 'اجاره' },
    { id: 2, label: 'آپارتمان' },
    { id: 3, label: 'تعداد اتاق' },
    { id: 4, label: 'املاک' },
];

const ORDER_OPTIONS = [
    { key: 'nearest', label: 'نزدیک‌ترین‌ها' },
    { key: 'newest', label: 'جدیدترین‌ها' },
    { key: 'cheapest', label: 'ارزان‌ترین' },
    { key: 'expensive', label: 'گران‌ترین' },
];

interface FilterBarProps {
    tree: CategoryNode[];
    selected: SelectedCategories;
    onCategoryConfirm: (newSelected: SelectedCategories) => void;
    onOrderChange?: (orderKey: string) => void;
    onWifiToggle?: (active: boolean) => void;
    onLocationToggle?: (active: boolean) => void;
    onFiltersPress?: () => void;
    hideCategoryButton?: boolean;
    wifiActive?: boolean;        // 👈 add
    locationActive?: boolean;
}

export default function FilterBar({
    tree,
    selected,
    onCategoryConfirm,
    onOrderChange,
    onWifiToggle,
    onLocationToggle,
    onFiltersPress,
}: FilterBarProps) {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeAttrs, setActiveAttrs] = useState<number[]>([1, 2]);
    const [orderIndex, setOrderIndex] = useState(0);
    const [wifiActive, setWifiActive] = useState(false);
    const [locationActive, setLocationActive] = useState(true);
    const [orderMenuVisible, setOrderMenuVisible] = useState(false);

    const removeAttr = (id: number) => setActiveAttrs(prev => prev.filter(a => a !== id));
    const activeAttrCount = activeAttrs.length;

    const cycleOrder = () => {
        const next = (orderIndex + 1) % ORDER_OPTIONS.length;
        setOrderIndex(next);
        onOrderChange?.(ORDER_OPTIONS[next].key);
        setOrderMenuVisible(false);
    };

    const selectOrder = (index: number) => {
        setOrderIndex(index);
        onOrderChange?.(ORDER_OPTIONS[index].key);
        setOrderMenuVisible(false);
    };

    const toggleWifi = () => {
        const next = !wifiActive;
        setWifiActive(next);
        onWifiToggle?.(next);
    };

    const toggleLocation = () => {
        const next = !locationActive;
        setLocationActive(next);
        onLocationToggle?.(next);
    };

    return (
        <>
            {/* ── Row 1: filter icons ── */}
            <View style={styles.iconsRow}>

                {/* LEFT: Ordering button */}


                {/* RIGHT: 4 icon buttons */}
                <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                    <LayoutGrid size={20} color={colors.text} strokeWidth={1.8} />
                    <Text style={styles.iconLabel}>{t('category.title')}</Text>
                </TouchableOpacity>

                <View style={styles.iconDivider} />


                <TouchableOpacity style={styles.iconButton} onPress={onFiltersPress}>
                    <SlidersHorizontal size={20} color={colors.text} strokeWidth={1.8} />
                    <Text style={styles.iconLabel}>{t('filter.filters')}</Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />

                <TouchableOpacity style={styles.iconButton} onPress={toggleLocation}>
                    <MapPin
                        size={20}
                        color={locationActive ? colors.primary : colors.text}
                        strokeWidth={1.8}
                    />
                    <Text style={[styles.iconLabel, locationActive && { color: colors.primary }]}>
                        {t('filter.from_location')}
                    </Text>
                </TouchableOpacity>

                <View style={styles.iconDivider} />

                <TouchableOpacity style={styles.iconButton} onPress={toggleWifi}>
                    <Wifi
                        size={20}
                        color={wifiActive ? colors.primary : colors.text}
                        strokeWidth={1.8}
                    />
                    <Text style={[styles.iconLabel, wifiActive && { color: colors.primary }]}>
                        {t('filter.from_wifi')}
                    </Text>
                </TouchableOpacity>

                <View style={styles.iconDivider} />

                <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() => setOrderMenuVisible(v => !v)}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={14} color={colors.primary} strokeWidth={2.5} />
                    <Text style={styles.orderLabel} numberOfLines={1}>
                        {ORDER_OPTIONS[orderIndex].label}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* ── Order dropdown menu ── */}
            {orderMenuVisible && (
                <View style={styles.orderMenu}>
                    {ORDER_OPTIONS.map((opt, i) => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.orderMenuItem, i === orderIndex && styles.orderMenuItemActive]}
                            onPress={() => selectOrder(i)}
                        >
                            <Text style={[
                                styles.orderMenuText,
                                i === orderIndex && { color: colors.primary, fontFamily: fonts.bold }
                            ]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* ── Row 2: attribute chips ── */}
            {activeAttrCount > 0 && (
                <View style={styles.attrsRow}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.attrsScroll}
                    >
                        <View style={styles.attrCountChip}>
                            <SlidersHorizontal size={12} color={colors.primary} strokeWidth={2} />
                            <Text style={styles.attrCountText}>
                                {activeAttrCount} {t('filter.active_filters')}
                            </Text>
                        </View>
                        {MOCK_ATTRIBUTES.filter(a => activeAttrs.includes(a.id)).map(attr => (
                            <View key={attr.id} style={styles.attrChipActive}>
                                <TouchableOpacity
                                    onPress={() => removeAttr(attr.id)}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                    <X size={11} color={colors.text} strokeWidth={2.5} />
                                </TouchableOpacity>
                                <Text style={styles.attrChipText}>{attr.label}</Text>
                            </View>
                        ))}
                        {MOCK_ATTRIBUTES.filter(a => !activeAttrs.includes(a.id)).map(attr => (
                            <TouchableOpacity
                                key={attr.id}
                                style={styles.attrChipInactive}
                                onPress={() => setActiveAttrs(prev => [...prev, attr.id])}
                            >
                                <Text style={styles.attrChipText}>{attr.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {modalVisible && (
                <CategoryModal
                    visible={true}
                    tree={tree}
                    onClose={() => setModalVisible(false)}
                    onConfirm={(newSelected) => {
                        onCategoryConfirm(newSelected);
                        setModalVisible(false);
                    }}
                    initialSelected={selected}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    iconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingVertical: 10,
        paddingHorizontal: 4,
    },

    /* Ordering button — left side, wider */
    orderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingHorizontal: 8,
        minWidth: 100,
    },
    orderLabel: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color: colors.primary,
        textAlign: 'right',
    },

    /* Order dropdown */
    orderMenu: {
        position: 'absolute',
        top: 44,          // sits just below the icons row
        left: 8,
        backgroundColor: colors.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        zIndex: 999,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        overflow: 'hidden',
        minWidth: 140,
    },
    orderMenuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    orderMenuItemActive: {
        backgroundColor: colors.primaryLight ?? '#EEF4FF',
    },
    orderMenuText: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.text,
        textAlign: 'right',
    },

    /* Icon buttons */
    iconButton: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    iconLabel: {
        fontFamily: fonts.regular,
        fontSize: 11,
        color: colors.text,
    },
    iconDivider: {
        width: 1,
        height: 28,
        backgroundColor: colors.border,
    },

    /* Attribute chips row */
    attrsRow: {
        backgroundColor: colors.background,
    },
    attrsScroll: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    attrCountChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: colors.surface,
        gap: 4,
    },
    attrCountText: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color: colors.primary,
    },
    attrChipActive: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 5,
    },
    attrChipInactive: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    attrChipText: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.text,
    },
});