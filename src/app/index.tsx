import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import AppProvider from "./providers/AppProvider";

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AppProvider>
    );
}
