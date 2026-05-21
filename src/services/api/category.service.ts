import { apiClient } from '@/src/services/api/client';
import { endpoints } from '@/src/services/api/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'categories_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface Category {
    id: number;
    category_id: number;
    parent_id: number;
    is_parent: number;
    priority: number;
    translate: string;
    is_active: number;
}

interface CategoriesResponse {
    result: boolean;
    data: {
        result: Category[];
    };
}

interface CacheEntry {
    data: Category[];
    timestamp: number;
}

export interface CategoryNode extends Category {
    children: CategoryNode[];
}

export function buildCategoryTree(flat: Category[]): CategoryNode[] {
    const map = new Map<number, CategoryNode>();

    // ✅ Use category_id as the key (not id)
    flat.forEach(item => {
        map.set(item.category_id, { ...item, children: [] });
    });

    const roots: CategoryNode[] = [];

    map.forEach(node => {
        if (node.parent_id === 0) {
            roots.push(node);
        } else {
            // ✅ parent_id points to category_id of parent
            const parent = map.get(node.parent_id);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    const sortByPriority = (nodes: CategoryNode[]) => {
        nodes.sort((a, b) => a.priority - b.priority);
        nodes.forEach(n => sortByPriority(n.children));
    };
    sortByPriority(roots);

    return roots;
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
            const entry: CacheEntry = JSON.parse(cached);
            if (Date.now() - entry.timestamp < CACHE_TTL) {
                return entry.data;
            }
        }
    } catch {
        // cache miss
    }

    const res = await apiClient.get<CategoriesResponse>(
        endpoints.categories.list
    );

    if (res.result === true && Array.isArray(res.data?.result)) {
        const data = res.data.result as Category[];

        try {
            const entry: CacheEntry = { data, timestamp: Date.now() };
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        } catch {
            // ignore
        }

        return data;
    }

    throw new Error('Failed to fetch categories');
}

export async function clearCategoryCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
}