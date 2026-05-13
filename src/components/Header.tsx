import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onBackPress,
    rightComponent
}) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
                {showBack ? (
                    <TouchableOpacity onPress={onBackPress} style={styles.leftButton}>
                        <Text style={[styles.backText, { color: theme.colors.primary }]}>←</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.leftButton} />
                )}

                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {title || "Hug"}
                </Text>

                <View style={styles.rightButton}>
                    {rightComponent}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    leftButton: {
        width: 40,
    },
    rightButton: {
        width: 40,
        alignItems: 'flex-end',
    },
    backText: {
        fontSize: 24,
    },
});