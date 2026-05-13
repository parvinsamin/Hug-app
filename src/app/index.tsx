import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { ThemeProvider, useTheme } from "../context/ThemeProvider";
import AppNavigator from "./navigation/AppNavigator";


function Root() {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme.navigation}>
            <AppNavigator />
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <Root />
        </ThemeProvider>
    );
}
