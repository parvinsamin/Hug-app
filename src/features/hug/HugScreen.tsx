// src/features/hug/HugScreen.tsx
import HomeAdsList from '@/src/screens/tabs/home/HomeAdsList';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HugScreen() {
    return (
        <View style={styles.container}>
            <HomeAdsList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
