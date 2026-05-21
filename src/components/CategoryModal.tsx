// src/components/CategoryModal.tsx
import { CategoryNode } from '@/src/services/api/category.service';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { ArrowLeft, Check, ChevronLeft, Minus, Search } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type SelectedCategories = Set<number>;
type CheckState = 'none' | 'partial' | 'full';

interface StackEntry {
    node: CategoryNode;
    list: CategoryNode[];
}

interface CategoryModalProps {
    visible: boolean;
    /** Pre-built tree passed from parent — no loading needed */
    tree: CategoryNode[];
    onClose: () => void;
    onConfirm: (selected: SelectedCategories) => void;
    initialSelected?: SelectedCategories;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllIds(node: CategoryNode): number[] {
    const ids: number[] = [node.id];
    node.children.forEach(c => ids.push(...getAllIds(c)));
    return ids;
}

function countLeaves(node: CategoryNode): number {
    if (node.children.length === 0) return 1;
    return node.children.reduce((s, c) => s + countLeaves(c), 0);
}

function countSelectedLeaves(node: CategoryNode, sel: SelectedCategories): number {
    if (node.children.length === 0) return sel.has(node.id) ? 1 : 0;
    return node.children.reduce((s, c) => s + countSelectedLeaves(c, sel), 0);
}

function getCheckState(node: CategoryNode, sel: SelectedCategories): CheckState {
    const total = countLeaves(node);
    const count = countSelectedLeaves(node, sel);
    if (count === 0) return 'none';
    if (count === total) return 'full';
    return 'partial';
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

function Checkbox({ state, onPress }: { state: CheckState; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.checkbox, state !== 'none' && styles.checkboxActive]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            {state === 'full' && <Check size={13} color="#fff" strokeWidth={3} />}
            {state === 'partial' && <Minus size={13} color="#fff" strokeWidth={3} />}
        </Pressable>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CategoryModal({
    visible,
    tree,
    onClose,
    onConfirm,
    initialSelected = new Set(),
}: CategoryModalProps) {
    const { t } = useTranslation();

    const [selected, setSelected] = useState<SelectedCategories>(new Set(initialSelected));
    const [stack, setStack] = useState<StackEntry[]>([]);
    const [search, setSearch] = useState('');

    const selectedRef = useRef(selected);
    selectedRef.current = selected;

    const currentList = stack.length > 0 ? stack[stack.length - 1].list : tree;

    useEffect(() => {
        if (visible) {
            setSelected(new Set(initialSelected));
            setStack([]);
            setSearch('');
        }
    }, [visible]);

    // ── Flatten for search ────────────────────────────────────────────────────
    const allFlat = useMemo(() => {
        const result: CategoryNode[] = [];
        const traverse = (nodes: CategoryNode[]) =>
            nodes.forEach(n => { result.push(n); traverse(n.children); });
        traverse(tree);
        return result;
    }, [tree]);

    const searchResults = useMemo(() => {
        if (!search.trim()) return [];
        return allFlat.filter(n => n.translate.includes(search.trim()));
    }, [search, allFlat]);

    // ── Toggle ────────────────────────────────────────────────────────────────
    const toggleNode = (node: CategoryNode) => {
        const ids = getAllIds(node);
        const state = getCheckState(node, selectedRef.current);
        setSelected(prev => {
            const next = new Set(prev);
            if (state === 'full') {
                ids.forEach(id => next.delete(id));
            } else {
                ids.forEach(id => next.add(id));
            }
            return next;
        });
    };

    // ── Select all ────────────────────────────────────────────────────────────
    const allIds = useMemo(() => allFlat.map(n => n.id), [allFlat]);

    const globalState: CheckState = useMemo(() => {
        if (allIds.length === 0) return 'none';
        const count = allIds.filter(id => selected.has(id)).length;
        if (count === 0) return 'none';
        if (count === allIds.length) return 'full';
        return 'partial';
    }, [allIds, selected]);

    const handleSelectAll = () => {
        setSelected(globalState === 'full' ? new Set() : new Set(allIds));
    };

    // ── Navigation ────────────────────────────────────────────────────────────
    const drillInto = (node: CategoryNode) => {
        setStack(prev => [...prev, { node, list: node.children }]);
        setSearch('');
    };

    const goBack = () => {
        setStack(prev => prev.slice(0, -1));
        setSearch('');
    };

    const handleConfirm = () => {
        onConfirm(new Set(selected));
        onClose();
    };

    // ── Leaf count ────────────────────────────────────────────────────────────
    const leafIds = useMemo(
        () => allFlat.filter(n => n.children.length === 0).map(n => n.id),
        [allFlat]
    );
    const selectedLeafCount = leafIds.filter(id => selected.has(id)).length;

    // ── Render item ───────────────────────────────────────────────────────────
    const displayList = search.trim() ? searchResults : currentList;

    const renderItem = ({ item }: { item: CategoryNode }) => {
        const state = getCheckState(item, selected);
        const hasChildren = item.children.length > 0 && !search.trim();

        return (
            <View style={styles.row}>
                {/* CHEVRON left — drill in */}
                <Pressable
                    style={styles.chevronArea}
                    onPress={() => hasChildren && drillInto(item)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {hasChildren
                        ? <ChevronLeft size={18} color={colors.muted} />
                        : <View style={{ width: 18 }} />
                    }
                </Pressable>

                {/* LABEL center */}
                <Pressable
                    style={styles.rowLabelArea}
                    onPress={() => hasChildren ? drillInto(item) : toggleNode(item)}
                >
                    <Text style={styles.rowText} numberOfLines={1}>
                        {item.translate}
                    </Text>
                </Pressable>

                {/* CHECKBOX right */}
                <Checkbox state={state} onPress={() => toggleNode(item)} />
            </View>
        );
    };

    const headerTitle = stack.length > 0
        ? stack[stack.length - 1].node.translate
        : t('category.title');

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={stack.length > 0 ? goBack : onClose}
        >
            <SafeAreaView style={styles.safeArea}>

                {/* Top bar */}
                <View style={styles.topBar}>
                    <Pressable onPress={handleConfirm} style={styles.topBarSide}>
                        <Text style={styles.confirmText}>{t('category.confirm')}</Text>
                    </Pressable>
                    <Text style={styles.topBarTitle} numberOfLines={1}>{headerTitle}</Text>
                    <Pressable
                        onPress={stack.length > 0 ? goBack : onClose}
                        style={[styles.topBarSide, styles.topBarRight]}
                    >
                        <Text style={styles.cancelText}>{t('category.cancel')}</Text>
                    </Pressable>
                </View>

                {/* Back row */}
                {stack.length > 0 && (
                    <Pressable style={styles.backRow} onPress={goBack}>
                        <ArrowLeft size={18} color={colors.primary} />
                        <Text style={styles.backText}>
                            {stack.length > 1
                                ? stack[stack.length - 2].node.translate
                                : t('category.title')}
                        </Text>
                    </Pressable>
                )}

                {/* Search */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('category.search_placeholder')}
                            placeholderTextColor={colors.muted}
                            value={search}
                            onChangeText={setSearch}
                            textAlign="right"
                        />
                        <Search size={16} color={colors.muted} />
                    </View>
                </View>

                {/* Select all */}
                {!search.trim() && (
                    <>
                        <Pressable style={styles.selectAllRow} onPress={handleSelectAll}>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>{selectedLeafCount}</Text>
                            </View>
                            <Text style={styles.selectAllText}>{t('category.select_all')}</Text>
                            <Checkbox state={globalState} onPress={handleSelectAll} />
                        </Pressable>
                        <View style={styles.divider} />
                    </>
                )}

                {/* List — no loading since tree is passed from parent */}
                <FlatList
                    key={`list-${stack.length}`}
                    data={displayList}
                    keyExtractor={item => `${item.category_id}-${stack.length}`}
                    renderItem={renderItem}
                    extraData={selected}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.errorText}>{t('category.no_results')}</Text>
                        </View>
                    }
                />

            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    topBarSide: { minWidth: 60 },
    topBarRight: { alignItems: 'flex-end' },
    topBarTitle: {
        flex: 1, fontFamily: fonts.bold, fontSize: 15,
        color: colors.text, textAlign: 'center',
    },
    confirmText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
    cancelText: { fontFamily: fonts.regular, fontSize: 15, color: colors.text },
    backRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10, gap: 8,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    backText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
    searchWrapper: { padding: 12 },
    searchRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.background, borderRadius: 10,
        paddingHorizontal: 12, height: 44, gap: 8,
    },
    searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
    selectAllRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    },
    selectAllText: {
        flex: 1, fontFamily: fonts.medium, fontSize: 14,
        color: colors.text, textAlign: 'right',
    },
    countBadge: {
        backgroundColor: colors.primary, borderRadius: 12,
        paddingHorizontal: 10, paddingVertical: 3,
        minWidth: 36, alignItems: 'center',
    },
    countBadgeText: { fontFamily: fonts.bold, fontSize: 13, color: colors.surface },
    row: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 16,
        backgroundColor: colors.surface, gap: 12,
    },
    chevronArea: { width: 24, alignItems: 'center', justifyContent: 'center' },
    rowLabelArea: { flex: 1 },
    rowText: {
        fontFamily: fonts.regular, fontSize: 14,
        color: colors.text, textAlign: 'right',
    },
    checkbox: {
        width: 22, height: 22, borderRadius: 5,
        borderWidth: 1.5, borderColor: colors.border,
        alignItems: 'center', justifyContent: 'center',
    },
    checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    divider: { height: 1, backgroundColor: colors.border },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    errorText: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center' },
});