import React from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useMarketIndexes } from '../hooks/useMarketIndexes';
import { MarketIndex } from '../types/api';
import { Stock } from '../types/Stock';
import StockCard from './StockCard';

/**
 * Transform MarketIndex data to Stock format for StockCard component
 */
const transformMarketIndexToStock = (index: MarketIndex): Stock => {
  const isPositive = index.change >= 0;
  
  // Generate a color based on the index symbol for consistency
  const colors = ['#FF9500', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#06B6D4'];
  const colorIndex = Math.abs(index.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  
  return {
    symbol: index.symbol,
    name: index.name,
    price: index.price, // MarketIndex uses 'value' property
    change: index.change,
    changePercent: index.changePercent,
    color: colors[colorIndex],
    positive: isPositive,
  };
};

const MarketSnapshot: React.FC = () => {
  const { data: marketIndexes, loading, error, refetch } = useMarketIndexes();
  
  // Transform market indexes to Stock format
  const transformedStocks = marketIndexes?.map(transformMarketIndexToStock) || [];
  
  // Show loading state
  if (loading.isLoading && !marketIndexes) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Snapshot</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFF" />
          <Text style={styles.loadingText}>Loading market data...</Text>
        </View>
      </View>
    );
  }

  // Show error state with retry option
  if (error.hasError && !marketIndexes) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Snapshot</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.errorMessage}</Text>
          {error.isRetryable && (
            <Text style={styles.retryText} onPress={refetch}>
              Tap to retry
            </Text>
          )}
        </View>
      </View>
    );
  }

  // Show empty state if no data
  if (!transformedStocks.length) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Snapshot</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No market data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {transformedStocks.map((stock, index) => (
          <StockCard key={stock.symbol || index} stock={stock} horizontal />
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
