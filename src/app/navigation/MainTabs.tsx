import { useTheme } from "@/src/context/ThemeProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import AdCreateScreen from "@/src/features/ad-create/AdCreateScreen";
import HugScreen from "@/src/features/hug/HugScreen"; // ← ایجاد می‌کنیم
import MessagesScreen from "@/src/features/messages/MessagesScreen";
import ProfileScreen from "@/src/features/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + "80",
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false, // همه تب‌ها هدر خود را دارند
      }}
    >
      <Tab.Screen
        name="Hug"
        component={HugScreen}
        options={{ title: t("tabs.home") }}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ title: t("tabs.messages") }}
      />

      <Tab.Screen
        name="CreateAd"
        component={AdCreateScreen}
        options={{ title: t("tabs.create_ad") }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("tabs.profile") }}
      />
    </Tab.Navigator>
  );
}