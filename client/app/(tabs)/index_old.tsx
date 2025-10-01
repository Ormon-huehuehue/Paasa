import ExploreHeader from '@/components/ExploreHeader';
import MarketSnapshot from '@/components/MarketSnapshot';
import NewsSection from '@/components/NewsSection';
import StockLists from '@/components/StockLists';
import StockSpotlight from '@/components/StockSpotlight';
import Colors from '@/constants/Colors';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ExploreHeader />
      <ScrollView style={styles.container}>
        <MarketSnapshot />
        <StockLists />
        <StockSpotlight />
        <NewsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});