import HugScreen from '@/src/features/hug/HugScreen';
import MessagesScreen from '@/src/features/messages/MessagesScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Hug" component={HugScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
        </Stack.Navigator>
    );
}
