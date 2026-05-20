// src/screens/tabs/home/HomeAdsList.tsx
import CategoryChips from '@/src/components/CategoryChips';
import ListingCard from '@/src/components/ListingCard';
import SystemBanner from '@/src/components/SystemBanner';
import ENV from '@/src/config';
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

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ✅ real API response — result/count/host at TOP level (not inside data)
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

// ─── Hardcoded filters ────────────────────────────────────────────────────────
const DISTANCE = 3;
const DISTANCE_TYPE = 'k';

// ─── Helper: format date to time ago ─────────────────────────────────────────
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
    const { location } = useAppStore();
    const { t } = useTranslation();
    const pageRef = useRef(1);
    const [hugs, setHugs] = useState<HugItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [categoryId, setCategoryId] = useState('all');
    const [error, setError] = useState<string | null>(null);

    const loadingRef = useRef(false);

    // ✅ has more pages if we haven't loaded all items yet
    const hasMore = hugs.length < totalCount && totalCount > 0;

    // ─── Fetch hugs ───────────────────────────────────────────────────────
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
                title: '',
                page: pageNum.toString(),
                wifi: 'Hilda.Hana-2.4',
            });

            // ✅ use real location from store
            if (location?.lat) params.append('lat', location.lat.toString());
            if (location?.long) params.append('long', location.long.toString());

            console.log('📡 Fetching page:', pageNum, 'url:', `${endpoints.hugs.list}?${params.toString()}`);

            const res = await apiClient.get<HugsListResponse>(
                `${endpoints.hugs.list}?${params.toString()}`
            );

            console.log('🔍 RAW response:', JSON.stringify(res).slice(0, 500));
            // ✅ result is array when successful, false when no data
            if (res.result === true && Array.isArray(res.data?.result)) {
                const items = res.data.result as HugItem[];
                const count = res.data.count ?? 0;

                setTotalCount(count);
                // ✅ replace list on first page, append on next pages
                setHugs(prev => replace ? items : [...prev, ...items]);
                setPage(pageNum);
                pageRef.current = pageNum;

                if (items.length === 0) {
                    setError(t('hugs.no_ads_nearby'));
                }
            } else {
                // result is false — no data
                if (replace) {
                    setHugs([]);
                    setTotalCount(0);
                    setError(t('hugs.no_ads_nearby'));
                }
            }
        } catch (err) {
            console.log('❌ Fetch error:', err);
            setError(t('common.network_error'));
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ─── Load on mount + when location/category changes ──────────────────
    useEffect(() => {
        fetchHugs(1, true);
    }, [location?.lat, location?.long, categoryId]);

    // ─── Pull to refresh ──────────────────────────────────────────────────
    const onRefresh = () => {
        setRefreshing(true);
        fetchHugs(1, true);
    };
    const onScroll = () => {
        console.log('scrolling...')
        if (!loadingRef.current && hasMore) {
            fetchHugs(pageRef.current + 1);
        }
    };
    // ─── Infinite scroll — load next page ────────────────────────────────
    const onEndReached = () => {
        console.log('📜 End reached - hasMore:', hasMore, 'page:', pageRef.current);
        if (!loadingRef.current && hasMore) {
            fetchHugs(pageRef.current + 1);
        }
    };

    // ─── Footer ───────────────────────────────────────────────────────────
    const renderFooter = () => {
        if (loading && hugs.length > 0) {
            return (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#0099CC" />
                </View>
            );
        }
        if (!hasMore && hugs.length > 0) {
            return (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#999', fontSize: 13 }}>
                        {t('hugs.all_loaded')}
                    </Text>
                </View>
            );
        }
        return null;
    };

    // ─── Empty state ──────────────────────────────────────────────────────
    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
                <Text style={{ color: '#999', fontSize: 15, textAlign: 'center', paddingHorizontal: 32 }}>
                    {error ?? t('hugs.no_ads_nearby')}
                </Text>
            </View>
        );
    };

    // ─── Initial loading ──────────────────────────────────────────────────
    if (loading && hugs.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0099CC" />
            </View>
        );
    }

    return (

        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <CategoryChips
                onSelectionChange={(categoryId) => {
                    setCategoryId(categoryId);
                }}
            />
            <FlatList
                data={hugs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <ListingCard
                        title={item.title}
                        image={item.image ? `${ENV.api.imageBaseUrl}${item.image}` : undefined}
                        location={item.address}
                        timeAgo={getTimeAgo(item.date, t)}
                        category={item.categories_names}
                        distance={item.user_distance}
                        mirrored={index === 0}
                    />
                )}
                ListHeaderComponent={<SystemBanner />}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onScroll={onScroll}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0099CC']}
                        tintColor="#0099CC"
                    />
                }
            />
        </View>
    );
}
