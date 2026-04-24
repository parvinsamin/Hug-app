import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import AdCreateScreen from "../../features/ad-create/AdCreateScreen";
import HugScreen from "../../features/hug/HugScreen";
import MessagesScreen from "../../features/messages/MessagesScreen";
import ProfileScreen from "../../features/profile/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Hug" component={HugScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="CreateAd" component={AdCreateScreen} />
        </Stack.Navigator>
    );
}
