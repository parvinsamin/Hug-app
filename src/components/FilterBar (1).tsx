// src/components/FilterBar.tsx
import { CategoryNode } from '@/src/services/api/category.service';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { LayoutGrid, MapPin, SlidersHorizontal, Wifi, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryModal, { SelectedCategories } from './CategoryModal';

const MOCK_ATTRIBUTES = [
    { id: 1, label: 'اجاره' },
    { id: 2, label: 'آپارتمان' },
    { id: 3, label: 'تعداد اتاق' },
    { id: 4, label: 'املاک' },
];

interface FilterBarProps {
    tree: CategoryNode[];
    selected: SelectedCategories;
    onCategoryConfirm: (newSelected: SelectedCategories) => void;
}

export default function FilterBar({ tree, selected, onCategoryConfirm }: FilterBarProps) {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeAttrs, setActiveAttrs] = useState<number[]>([1, 2]);

    const removeAttr = (id: number) => setActiveAttrs(prev => prev.filter(a => a !== id));
    const activeAttrCount = activeAttrs.length;

    const testApi = async () => {
        try {
            const res = await fetch('https://hugmerchant.com/api/mobile/geo/whereAmI');
            const text = await res.text();
            Alert.alert('Success ✅', text.slice(0, 200));
        } catch (e: any) {
            Alert.alert('Error ❌', e.message + ' | ' + e.code);
        }
    };

    return (
        <>
            {/* ── Row 1: filter icons — gray background ── */}
            <View style={styles.iconsRow}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                    <LayoutGrid size={20} color={colors.text} strokeWidth={1.8} />
                    <Text style={styles.iconLabel}>{t('category.title')}</Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />
                <TouchableOpacity style={styles.iconButton}>
                    <SlidersHorizontal size={20} color={colors.text} strokeWidth={1.8} />
                    <Text style={styles.iconLabel}>{t('filter.filters')}</Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />
                <TouchableOpacity style={styles.iconButton}>
                    <MapPin size={20} color={colors.primary} strokeWidth={1.8} />
                    <Text style={[styles.iconLabel, { color: colors.primary }]}>{t('filter.from_location')}</Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />
                <TouchableOpacity style={styles.iconButton}>
                    <Wifi size={20} color={colors.text} strokeWidth={1.8} />
                    <Text style={styles.iconLabel}>{t('filter.from_wifi')}</Text>
                </TouchableOpacity>
            </View>

            {/* ── DEBUG: Test API button — remove after testing ── */}
            <TouchableOpacity style={styles.debugButton} onPress={testApi}>
                <Text style={styles.debugText}>🔧 Test API</Text>
            </TouchableOpacity>

            {/* ── Row 2: attribute chips — gray background ── */}
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
        justifyContent: 'space-around',
        backgroundColor: colors.background,
        paddingVertical: 10,
    },
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
    debugButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 8,
        alignItems: 'center',
    },
    debugText: {
        color: '#fff',
        fontFamily: fonts.bold,
        fontSize: 13,
    },
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
