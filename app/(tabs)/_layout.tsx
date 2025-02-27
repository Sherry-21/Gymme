import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  useEffect(() => {
    
  });
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["gymme"].tint,
        tabBarInactiveTintColor: Colors["gymme"].placeholder,
        tabBarStyle: {
          backgroundColor: "#F39C12",
          padding: 10,
          height: 55,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="article"
        options={{
          title: "article",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "newspaper" : "newspaper-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="other"
        options={{
          title: "other",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
