import { useTheme } from "@/src/context/ThemeProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { Header } from "@/src/components/Header";
import AdCreateScreen from "@/src/features/ad-create/AdCreateScreen";
import MessagesScreen from "@/src/features/messages/MessagesScreen";
import ProfileScreen from "@/src/features/profile/ProfileScreen";
import HomeAdsList from "@/src/screens/tabs/home/HomeAdsList";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Header
        hugCount={354}
        onLocationPress={() => console.log("location")}
        onNotificationPress={() => console.log("notifications")}
        onMyHugPress={() => console.log("my hug")}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text + "80",
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Hug"
          component={HomeAdsList}
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
    </SafeAreaView>
  );
}