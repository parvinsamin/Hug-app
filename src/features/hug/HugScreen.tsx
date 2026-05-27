// src/features/hug/HugScreen.tsx
import { SelectedCategories } from '@/src/components/CategoryModal';
import HomeAdsList from '@/src/screens/tabs/home/HomeAdsList';
import {
    buildCategoryTree,
    CategoryNode,
    fetchCategories,
} from '@/src/services/api/category.service';
import { useAppStore } from '@/src/store/appStore';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

export default function HugScreen() {
    const { width } = useWindowDimensions();
    const isWide = width >= 768;
    const { selectedCategoryIds, setSelectedCategoryIds } = useAppStore();

    const [tree, setTree] = useState<CategoryNode[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(
        new Set(selectedCategoryIds)
    );

    useEffect(() => {
        fetchCategories()
            .then(flat => {
                const built = buildCategoryTree(flat);
                setTree(built);
                if (selectedCategoryIds.length === 0) {
                    const allFlat: CategoryNode[] = [];
                    const traverse = (nodes: CategoryNode[]) =>
                        nodes.forEach(n => { allFlat.push(n); traverse(n.children); });
                    traverse(built);
                    const allIds = allFlat.map(n => n.category_id);
                    setSelectedCategories(new Set(allIds));
                    setSelectedCategoryIds(allIds);
                }
            })
            .catch(() => { });
    }, []);

    const handleCategoryConfirm = (newSelected: SelectedCategories) => {
        setSelectedCategories(newSelected);
        setSelectedCategoryIds(Array.from(newSelected).map(Number));
    };

    return (
        <View style={{ flex: 1 }}>
            <HomeAdsList
                tree={tree}
                selectedCategories={selectedCategories}
                onCategoryConfirm={handleCategoryConfirm}
                isWide={isWide}
            />
        </View>
    );
}