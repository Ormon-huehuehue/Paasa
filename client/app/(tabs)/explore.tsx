import Header from '@/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import MarketSnapshot from '../../components/MarketSnapshot';
import NewsSection from '../../components/NewsSection';
import StockSpotlight from '../../components/StockSpotlight';
import WatchlistSection from '../../components/WatchlistSection';

const TradingDashboard: React.FC = () => {

  return (
    <LinearGradient
      colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header heading = "Explore"/> 
          {/* <ActionButtons /> */}
          <MarketSnapshot />
          <WatchlistSection />
          <StockSpotlight />
          <NewsSection limit={5} showTitle={true} title="Latest News" />
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
