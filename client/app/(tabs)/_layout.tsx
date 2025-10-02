import { Tabs } from 'expo-router';
import React from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import { View } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {

 const insets = useSafeAreaInsets();

  return (
    <LinearGradient
          colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
          style={{flex:1}}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <BottomNavigation {...props} />}>
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
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
          name="funds"
          options={{
            title: 'Funds',
          }}
          />
      </Tabs>
    </LinearGradient>
  );
}
