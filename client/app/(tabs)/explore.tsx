import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';

// Components


import ExploreHeader from '@/components/ExploreHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarketSnapshot from '../../components/MarketSnapshot';
import NewsSection from '../../components/NewsSection';
import WatchlistSection from '../../components/WatchlistSection';

const TradingDashboard: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ExploreHeader/> 
          {/* <ActionButtons /> */}
          <MarketSnapshot />
          <WatchlistSection />
          <NewsSection />
        </ScrollView>      
    </LinearGradient>
  );
};

export default TradingDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
