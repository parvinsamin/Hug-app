import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MessagesScreen from "@/src/features/messages/MessagesScreen";
import HomeAdsList from "@/src/screens/tabs/home/HomeAdsList";


const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="HomeAdsList"
                component={HomeAdsList}
                options={{ title: "Ads" }}
            />

            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
            />
            {/* 
      <Tab.Screen
        name="CreateAd"
        component={CreateAd}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
      /> */}
        </Tab.Navigator>
    );
}
