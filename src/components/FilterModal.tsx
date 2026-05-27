// src/components/FilterModal.tsx
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';
import { SlidersHorizontal, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type DistanceType = 'k' | 'm';

export interface FilterState {
    distance: number;
    distanceType: DistanceType;
    locationActive: boolean;
    wifiActive: boolean;
    manualRefresh: boolean;
}

interface FilterModalProps {
    visible: boolean;
    initialState: FilterState;
    onClose: () => void;
    onApply: (state: FilterState) => void;
}

const DEFAULT_STATE: FilterState = {
    distance: 3,
    distanceType: 'k',
    locationActive: true,
    wifiActive: false,
    manualRefresh: false,
};

const SLIDER_MIN = 1;
const SLIDER_MAX = 50;
const SLIDER_STEPS = 10;
const STEP_VALUES = Array.from({ length: SLIDER_STEPS + 1 }, (_, i) =>
    Math.round(SLIDER_MIN + (i * (SLIDER_MAX - SLIDER_MIN)) / SLIDER_STEPS)
);

export default function FilterModal({
    visible,
    initialState,
    onClose,
    onApply,
}: FilterModalProps) {
    const { t } = useTranslation();
    const [state, setState] = useState<FilterState>(initialState);

    const update = (patch: Partial<FilterState>) =>
        setState(prev => ({ ...prev, ...patch }));

    const handleApply = () => {
        onApply(state);
        onClose();
    };

    const handleClose = () => {
        setState(initialState);
        onClose();
    };

    const handleDefault = () => {
        setState(DEFAULT_STATE);
    };

    // Slider thumb position as percentage
    const thumbPct = ((state.distance - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <X size={20} color={colors.text} strokeWidth={1.8} />
                        </TouchableOpacity>
                        <View style={styles.headerTitle}>
                            <SlidersHorizontal size={16} color={colors.text} strokeWidth={1.8} />
                            <Text style={styles.headerTitleText}>{t('filter.filters')}</Text>
                        </View>
                        <View style={{ width: 20 }} />
                    </View>

                    {/* Distance slider */}
                    <View style={styles.section}>
                        <View style={styles.sliderTrackWrapper}>
                            {/* Bubble */}
                            <View style={[styles.bubble, { left: `${thumbPct}%` as any }]}>
                                <Text style={styles.bubbleText}>{state.distance}</Text>
                            </View>
                            {/* Track */}
                            <View style={styles.track}>
                                <View style={[styles.trackFill, { width: `${thumbPct}%` as any }]} />
                            </View>
                            {/* Touch areas for steps */}
                            <View style={styles.stepsRow}>
                                {STEP_VALUES.map(v => (
                                    <TouchableOpacity
                                        key={v}
                                        style={styles.stepDot}
                                        onPress={() => update({ distance: v })}
                                    >
                                        <View style={[
                                            styles.dot,
                                            state.distance >= v && styles.dotActive,
                                        ]} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Step labels */}
                            <View style={styles.stepsLabels}>
                                {STEP_VALUES.map(v => (
                                    <Text key={v} style={styles.stepLabel}>{v}</Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Km / Mile */}
                    <View style={styles.section}>
                        <View style={styles.checkRow}>
                            <TouchableOpacity
                                style={styles.checkItem}
                                onPress={() => update({ distanceType: 'k' })}
                            >
                                <View style={[styles.checkbox, state.distanceType === 'k' && styles.checkboxActive]}>
                                    {state.distanceType === 'k' && <View style={styles.checkInner} />}
                                </View>
                                <Text style={styles.checkLabel}>{t('filter.kilometer')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.checkItem}
                                onPress={() => update({ distanceType: 'm' })}
                            >
                                <View style={[styles.checkbox, state.distanceType === 'm' && styles.checkboxActive]}>
                                    {state.distanceType === 'm' && <View style={styles.checkInner} />}
                                </View>
                                <Text style={styles.checkLabel}>{t('filter.mile')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Location toggle */}
                    <View style={styles.toggleRow}>
                        <Switch
                            value={state.locationActive}
                            onValueChange={v => update({ locationActive: v })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#fff"
                        />
                        <Text style={styles.toggleLabel}>{t('filter.receive_from_location')}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* WiFi toggle */}
                    <View style={styles.toggleRow}>
                        <Switch
                            value={state.wifiActive}
                            onValueChange={v => update({ wifiActive: v })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#fff"
                        />
                        <Text style={styles.toggleLabel}>{t('filter.receive_from_wifi')}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Manual refresh toggle */}
                    <View style={styles.toggleRow}>
                        <Switch
                            value={state.manualRefresh}
                            onValueChange={v => update({ manualRefresh: v })}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#fff"
                        />
                        <Text style={styles.toggleLabel}>{t('filter.manual_refresh')}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Bottom bar */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={handleDefault}>
                            <Text style={styles.defaultText}>{t('filter.default_settings')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyText}>{t('filter.apply')}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: 20,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitleText: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.text,
    },

    // Slider
    section: {
        marginBottom: 20,
    },
    sliderTrackWrapper: {
        paddingTop: 28,
        paddingHorizontal: 4,
    },
    bubble: {
        position: 'absolute',
        top: 0,
        transform: [{ translateX: -16 }],
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignItems: 'center',
        minWidth: 32,
    },
    bubbleText: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color: '#fff',
    },
    track: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    trackFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    stepsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -2,
    },
    stepDot: {
        padding: 6,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    dotActive: {
        backgroundColor: colors.primary,
    },
    stepsLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    stepLabel: {
        fontFamily: fonts.regular,
        fontSize: 10,
        color: colors.muted,
        textAlign: 'center',
        width: 20,
    },

    // Km/Mile
    checkRow: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-start',
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    checkInner: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    checkLabel: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.text,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },

    // Toggles
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    toggleLabel: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.text,
        flex: 1,
        textAlign: 'right',
        marginRight: 12,
    },

    // Bottom
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    defaultText: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.muted,
        textDecorationLine: 'underline',
    },
    applyBtn: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    applyText: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: '#fff',
    },
});