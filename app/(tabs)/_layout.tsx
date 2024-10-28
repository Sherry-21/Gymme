import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  useEffect(() => {
    console.log("INSERT HERE 2");
  })
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['gymme'].tint,
        tabBarInactiveTintColor: Colors['gymme'].placeholder,
        tabBarStyle: {
          backgroundColor: '#F39C12',
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 5,
        },
        headerShown: false
      }}>

      <Tabs.Screen
        name="indexes"
        options={{
          title: 'News',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'newspaper' : 'newspaper-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explores',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
