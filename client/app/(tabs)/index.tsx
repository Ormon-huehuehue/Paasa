import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';

// Components
import ActionButtons from '../../components/ActionButtons';
import BalanceSection from '../../components/BalanceSection';

import TrendingSection from '../../components/TrendingSection';
import WatchlistSection from '../../components/WatchlistSection';

const TradingDashboard: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <BalanceSection />
        <ActionButtons />
        <TrendingSection />
        <WatchlistSection />
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
