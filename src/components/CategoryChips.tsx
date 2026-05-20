// src/components/CategoryChips.tsx
import {
    CategoryNode,
    buildCategoryTree,
    fetchCategories,
} from '@/src/services/api/category.service';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CategoryModal, { SelectedCategories } from './CategoryModal';

interface CategoryChipsProps {
    onSelectionChange?: (categoryId: string) => void;
}

export default function CategoryChips({ onSelectionChange }: CategoryChipsProps) {
    const { t } = useTranslation();

    const [tree, setTree] = useState<CategoryNode[]>([]);
    const [selected, setSelected] = useState<SelectedCategories>(new Set());
    const [activeRoot, setActiveRoot] = useState<CategoryNode | null>(null);

    useEffect(() => {
        fetchCategories()
            .then(flat => setTree(buildCategoryTree(flat)))
            .catch(() => { });
    }, []);

    // Check if a root node has any selected descendant
    const hasSelection = (node: CategoryNode): boolean => {
        if (selected.has(node.id)) return true;
        return node.children.some(c => hasSelection(c));
    };

    const handleConfirm = useCallback((newSelected: SelectedCategories) => {
        setSelected(newSelected);
        const categoryId = newSelected.size === 0
            ? 'all'
            : Array.from(newSelected).join(',');
        onSelectionChange?.(categoryId);
    }, [onSelectionChange]);

    const handleClearAll = () => {
        setSelected(new Set());
        onSelectionChange?.('all');
    };

    return (
        <>
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {/* "All" chip */}
                    <TouchableOpacity
                        style={[styles.chip, selected.size === 0 && styles.chipActive]}
                        onPress={handleClearAll}
                    >
                        <Text style={[styles.chipText, selected.size === 0 && styles.chipTextActive]}>
                            {t('category.all_categories')}
                        </Text>
                    </TouchableOpacity>

                    {/* One chip per root category */}
                    {tree.map(node => {
                        console.log('chip:', node.translate, '| category_id:', node.category_id);
                        const isActive = hasSelection(node);
                        return (
                            <TouchableOpacity
                                key={node.category_id}
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={() => setActiveRoot(node)}
                            >
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                    {node.translate}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Modal — only opens for the tapped root */}
            {activeRoot !== null && (
                <CategoryModal
                    visible={true}
                    rootNode={activeRoot}
                    onClose={() => setActiveRoot(null)}
                    onConfirm={handleConfirm}
                    initialSelected={selected}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    scroll: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
        flexDirection: 'row',
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: colors.chip,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.surface,
        borderColor: colors.primary,
    },
    chipText: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.chipText,
    },
    chipTextActive: {
        fontFamily: fonts.medium,
        color: colors.primary,
    },
});
