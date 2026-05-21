// src/components/SystemBanner.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/src/theme/colors';
import { fonts } from '@/src/theme/fonts';

interface SystemBannerProps {
    message?: string;
}

export default function SystemBanner({ message }: SystemBannerProps) {
    const { t } = useTranslation();

    return (
        <View style={styles.banner}>
            <Text style={styles.text}>
                {message ?? t('banner.systemMessage')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: colors.primary,
        marginHorizontal: 16,
        marginVertical: 10,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    text: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: '#fff',
        textAlign: 'right',
        lineHeight: 22,
    },
});
