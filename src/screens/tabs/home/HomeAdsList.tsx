// src/screens/tabs/home/HomeAdsList.tsx
import CategoryChips from '@/src/components/CategoryChips';
import { SelectedCategories } from '@/src/components/CategoryModal';
import FilterBar from '@/src/components/FilterBar';
import FilterModal, { FilterState } from '@/src/components/FilterModal';
import ListingCard from '@/src/components/ListingCard';
import SystemBanner from '@/src/components/SystemBanner';
import ENV from '@/src/config';
import { CategoryNode } from '@/src/services/api/category.service';
import { apiClient } from '@/src/services/api/client';
import { endpoints } from '@/src/services/api/endpoints';
import { useAppStore } from '@/src/store/appStore';
import { colors } from '@/src/theme/colors';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

const PROMO_CARD = {
    id: -1,
    title: 'خانه بومگردی- خانه بومگردی زیبا با امکانات کامل برای مسافران',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg',
    address: 'سیستان و بلوچستان، زاهدان، کاظم آباد',
    timeAgo: '۵ساعت پیش',
    category: 'بدون اتاق',
    rooms: 'بدون اتاق',
    area: 15000,
    capacity: 4,
    rent: '۵۰٬۰۰۰٬۰۰۰',
};

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

interface HomeAdsListProps {
    tree: CategoryNode[];
    selectedCategories: SelectedCategories;
    onCategoryConfirm: (newSelected: SelectedCategories) => void;
    isWide?: boolean;
}

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

const SIDEBAR_WIDTH = 190;
const CARD_MIN_WIDTH = 280;

const DEFAULT_FILTER: FilterState = {
    distance: 3,
    distanceType: 'k',
    locationActive: true,
    wifiActive: false,
    manualRefresh: false,
};

export default function HomeAdsList({
    tree,
    selectedCategories,
    onCategoryConfirm,
    isWide = false,
}: HomeAdsListProps) {
    const { location, searchTitle, selectedCategoryIds, setSelectedCategoryIds } = useAppStore();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const feedWidth = isWide ? width - SIDEBAR_WIDTH : width;
    const numColumns = isWide ? Math.max(3, Math.floor(feedWidth / CARD_MIN_WIDTH)) : 1;

    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [hugs, setHugs] = useState<HugItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);

    const allTreeIds = useMemo(() => {
        const flat: number[] = [];
        const traverse = (nodes: CategoryNode[]) =>
            nodes.forEach(n => { flat.push(n.category_id); traverse(n.children); });
        traverse(tree);
        return flat;
    }, [tree]);

    const safeCategoryIds = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [];
    const categoryId = (safeCategoryIds.length === 0 || safeCategoryIds.length === allTreeIds.length)
        ? 'all'
        : safeCategoryIds.map(Number).join(',');

    const hasMore = hugs.length < totalCount && totalCount > 0;

    const handleFilterApply = useCallback((newState: FilterState) => {
        setFilterState(newState);
    }, []);

    const fetchHugs = async (pageNum: number, replace = false) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            let query = `categoryId=${safeCategoryIds.map(Number).join(',')}`;
            query += `&distance=${filterState.distance}`;
            query += `&distance_type=${filterState.distanceType}`;
            query += `&title=${encodeURIComponent(searchTitle)}`;
            query += `&page=${pageNum}`;
            query += `&wifi=${filterState.wifiActive ? '1' : ''}`;
            if (filterState.locationActive && location?.lat) query += `&lat=${location.lat}`;
            if (filterState.locationActive && location?.long) query += `&long=${location.long}`;

            const res = await apiClient.get<HugsListResponse>(
                `${endpoints.hugs.list}?${query}`
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

    // ── Re-fetch when filters or location changes ──
    useEffect(() => {
        fetchHugs(1, true);
    }, [
        location?.lat,
        location?.long,
        categoryId,
        searchTitle,
        filterState.distance,
        filterState.distanceType,
        filterState.locationActive,
        filterState.wifiActive,
    ]);

    // ── Auto-refresh timer — only when manualRefresh is OFF ──
    useEffect(() => {
        if (refreshTimerRef.current) {
            clearInterval(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
        if (!filterState.manualRefresh) {
            refreshTimerRef.current = setInterval(() => {
                fetchHugs(1, true);
            }, 60000); // auto refresh every 60s
        }
        return () => {
            if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
        };
    }, [filterState.manualRefresh]);

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

    const ListHeader = useCallback(() => (
        <View>
            <SystemBanner />
            <ListingCard
                id={PROMO_CARD.id}
                title={PROMO_CARD.title}
                image={PROMO_CARD.image}
                location={PROMO_CARD.address}
                timeAgo={PROMO_CARD.timeAgo}
                category={PROMO_CARD.category}
                rooms={PROMO_CARD.rooms}
                area={PROMO_CARD.area}
                capacity={PROMO_CARD.capacity}
                rent={PROMO_CARD.rent}
                mirrored={true}
            />
            {!isWide && (
                <CategoryChips
                    tree={tree}
                    selected={selectedCategories}
                    onRemove={onCategoryConfirm}
                />
            )}
            <FilterBar
                tree={tree}
                selected={selectedCategories}
                onCategoryConfirm={onCategoryConfirm}
                onFiltersPress={() => setFilterModalVisible(true)}
                hideCategoryButton={isWide}
                wifiActive={filterState.wifiActive}
                locationActive={filterState.locationActive}
                onWifiToggle={v => setFilterState(p => ({ ...p, wifiActive: v }))}
                onLocationToggle={v => setFilterState(p => ({ ...p, locationActive: v }))}
            />
        </View>
    ), [tree, selectedCategories, onCategoryConfirm, isWide, filterState.wifiActive, filterState.locationActive]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <FilterModal
                visible={filterModalVisible}
                initialState={filterState}
                onClose={() => setFilterModalVisible(false)}
                onApply={handleFilterApply}
            />
            {loading && hugs.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    key={numColumns}
                    data={hugs}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={numColumns}
                    columnWrapperStyle={
                        numColumns > 1
                            ? { gap: 8, paddingHorizontal: 12 }
                            : undefined
                    }
                    ListHeaderComponent={ListHeader}
                    renderItem={({ item }) => (
                        <View style={numColumns > 1 ? { flex: 1 } : undefined}>
                            <ListingCard
                                id={item.id}
                                title={item.title}
                                image={item.image ? `${ENV.api.imageBaseUrl}${item.image}` : undefined}
                                location={item.address}
                                timeAgo={getTimeAgo(item.date, t)}
                                category={item.categories_names}
                                distance={item.user_distance}
                                mirrored={false}
                            />
                        </View>
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