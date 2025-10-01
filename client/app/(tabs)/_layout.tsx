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
        name="two"
        options={{
          title: 'Tab Two',
        }}
      />
    </Tabs>
  );
}
