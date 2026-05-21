// src/screens/tabs/home/HomeAdsList.tsx
import CategoryChips from '@/src/components/CategoryChips';
import { SelectedCategories } from '@/src/components/CategoryModal';
import FilterBar from '@/src/components/FilterBar';
import ListingCard from '@/src/components/ListingCard';
import SystemBanner from '@/src/components/SystemBanner';
import ENV from '@/src/config';
import {
    CategoryNode,
    buildCategoryTree,
    fetchCategories,
} from '@/src/services/api/category.service';
import { apiClient } from '@/src/services/api/client';
import { endpoints } from '@/src/services/api/endpoints';
import { useAppStore } from '@/src/store/appStore';
import { colors } from '@/src/theme/colors';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from 'react-native';

interface HugItem {
    id: number;
    hug_id: number;
    title: string;
    image: string;
    address: string;
    date: string;
    hug_type: string;
    categories_names: string;
    user_distance: number;
    hug_type_order: number;
    is_fav: number;
}

interface HugsListResponse {
    result: boolean;
    message: string;
    statusCode: number;
    data: {
        result: HugItem[];
        count: number;
        host: string;
    };
}

const DISTANCE = 3;
const DISTANCE_TYPE = 'k';

const getTimeAgo = (dateStr: string, t: (key: string, opts?: any) => string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1) return t('time.just_now');
    if (minutes < 60) return t('time.minutes_ago', { count: minutes });
    if (hours < 24) return t('time.hours_ago', { count: hours });
    return t('time.days_ago', { count: days });
};

export default function HomeAdsList() {
    // searchTitle is set by Header via appStore (debounced 500ms)
    const { location, searchTitle } = useAppStore();
    const { t } = useTranslation();

    const pageRef = useRef(1);
    const loadingRef = useRef(false);

    const [hugs, setHugs] = useState<HugItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [tree, setTree] = useState<CategoryNode[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(new Set());
    const [categoryId, setCategoryId] = useState('all');

    const hasMore = hugs.length < totalCount && totalCount > 0;

    useEffect(() => {
        fetchCategories()
            .then(flat => setTree(buildCategoryTree(flat)))
            .catch(() => { });
    }, []);

    const handleCategoryConfirm = (newSelected: SelectedCategories) => {
        setSelectedCategories(newSelected);
        const id = newSelected.size === 0
            ? 'all'
            : Array.from(newSelected).join(',');
        setCategoryId(id);
    };

    const fetchHugs = async (pageNum: number, replace = false) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                categoryId,
                distance: DISTANCE.toString(),
                distance_type: DISTANCE_TYPE,
                title: searchTitle, // from appStore
                page: pageNum.toString(),
                wifi: 'Hilda.Hana-2.4',
            });

            if (location?.lat) params.append('lat', location.lat.toString());
            if (location?.long) params.append('long', location.long.toString());

            const res = await apiClient.get<HugsListResponse>(
                `${endpoints.hugs.list}?${params.toString()}`
            );

            if (res.result === true && Array.isArray(res.data?.result)) {
                const items = res.data.result as HugItem[];
                const count = res.data.count ?? 0;
                setTotalCount(count);
                setHugs(prev => replace ? items : [...prev, ...items]);
                pageRef.current = pageNum;
                if (items.length === 0) setError(t('hugs.no_ads_nearby'));
            } else {
                if (replace) {
                    setHugs([]);
                    setTotalCount(0);
                    setError(t('hugs.no_ads_nearby'));
                }
            }
        } catch {
            setError(t('common.network_error'));
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload when location, categoryId, or searchTitle changes
    useEffect(() => {
        fetchHugs(1, true);
    }, [location?.lat, location?.long, categoryId, searchTitle]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHugs(1, true);
    };

    const onEndReached = () => {
        if (!loadingRef.current && hasMore) {
            fetchHugs(pageRef.current + 1);
        }
    };

    const renderFooter = () => {
        if (loading && hugs.length > 0) {
            return (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            );
        }
        if (!hasMore && hugs.length > 0) {
            return (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ color: colors.muted, fontSize: 13 }}>
                        {t('hugs.all_loaded')}
                    </Text>
                </View>
            );
        }
        return null;
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
                <Text style={{ color: colors.muted, fontSize: 15, textAlign: 'center', paddingHorizontal: 32 }}>
                    {error ?? t('hugs.no_ads_nearby')}
                </Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            {/* 1. System banner */}
            <SystemBanner />

            {/* 2. Category chips — only when filtered */}
            <CategoryChips
                tree={tree}
                selected={selectedCategories}
                onRemove={handleCategoryConfirm}
            />

            {/* 3. Filter bar */}
            <FilterBar
                tree={tree}
                selected={selectedCategories}
                onCategoryConfirm={handleCategoryConfirm}
            />

            {/* 4. Ads list — spinner only here */}
            {loading && hugs.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={hugs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <ListingCard
                            id={item.id}
                            title={item.title}
                            image={item.image ? `${ENV.api.imageBaseUrl}${item.image}` : undefined}
                            location={item.address}
                            timeAgo={getTimeAgo(item.date, t)}
                            category={item.categories_names}
                            distance={item.user_distance}
                            mirrored={index === 0}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </View>
    );
}