// src/components/CategoryChips.tsx
import { CategoryNode } from '@/src/services/api/category.service';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { X } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectedCategories } from './CategoryModal';

interface CategoryChipsProps {
    tree: CategoryNode[];
    selected: SelectedCategories;
    onRemove: (newSelected: SelectedCategories) => void;
}

const getAllIds = (node: CategoryNode): number[] => {
    const ids: number[] = [node.id];
    node.children.forEach(c => ids.push(...getAllIds(c)));
    return ids;
};

export default function CategoryChips({ tree, selected, onRemove }: CategoryChipsProps) {
    const { t } = useTranslation();

    const activeRoots = tree.filter(node => {
        const check = (n: CategoryNode): boolean =>
            selected.has(n.id) || n.children.some(check);
        return check(node);
    });

    if (activeRoots.length === 0) return null;

    const removeRoot = (node: CategoryNode) => {
        const idsToRemove = new Set(getAllIds(node));
        const next = new Set(selected);
        idsToRemove.forEach(id => next.delete(id));
        onRemove(next);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Count chip */}
                <View style={styles.countChip}>
                    <Text style={styles.countChipText}>
                        {activeRoots.length} {t('category.title')}
                    </Text>
                </View>

                {/* Active root chips with × */}
                {activeRoots.map(node => (
                    <View key={node.category_id} style={styles.chip}>
                        <TouchableOpacity
                            onPress={() => removeRoot(node)}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                            <X size={12} color={colors.primary} strokeWidth={2.5} />
                        </TouchableOpacity>
                        <Text style={styles.chipText}>{node.translate}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background, // gray — matches filter bar
    },
    scroll: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    countChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    countChipText: {
        fontFamily: fonts.bold,
        fontSize: 13,
        color: colors.primary,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 6,
    },
    chipText: {
        fontFamily: fonts.medium,
        fontSize: 13,
        color: colors.text,
    },
});