import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme } from "../theme/lightTheme";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
    const systemTheme = Appearance.getColorScheme();

    const [themeMode, setThemeMode] = useState(systemTheme || "light");

    const theme = themeMode === "dark" ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setThemeMode(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
