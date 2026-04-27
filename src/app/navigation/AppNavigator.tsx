// src/app/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AdCreateScreen from '@/src/features/ad-create/AdCreateScreen';
import HugScreen from '@/src/features/hug/HugScreen';
import MessagesScreen from '@/src/features/messages/MessagesScreen';
import ProfileScreen from '@/src/features/profile/ProfileScreen';
import NetworkError from '@/src/screens/errors/NetworkError';
import { SplashScreen } from '@/src/screens/SplashScreen';
import BootLoader from '../boot/BootLoader';
import MainTabs from './MainTabs';

export type RootStackParamList = {
    Splash: undefined;
    Boot: undefined;
    Hug: undefined;
    Messages: undefined;
    Profile: undefined;
    AdCreate: undefined;
    NetworkError: undefined;
    CountryNotSupported: undefined;
    Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Boot">
            <Stack.Screen
                name="Boot"
                component={BootLoader}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen
                name="Tabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Hug" component={HugScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AdCreate" component={AdCreateScreen} />
            <Stack.Screen name="CountryNotSupported" component={AdCreateScreen} />
            <Stack.Screen name="NetworkError" component={NetworkError} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
