import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { trendingStocks } from '../constants/DummyData';
import StockCard from './StockCard';

const MarketSnapshot: React.FC = () => {

  

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {trendingStocks.map((stock, index) => (
          <StockCard key={index} stock={stock} horizontal />
        ))}
      </ScrollView>
    </View>
  );
};

export default MarketSnapshot;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  trendingScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
