import { Tabs } from 'expo-router';
import React from 'react';
import BottomNavigation from '../../components/BottomNavigation';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomNavigation {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Aktivitas',
        }}
      />
      <Tabs.Screen
        name="stocks"
        options={{
          title: 'Stocks',
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
