import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stock } from '../types/Stock';

interface StockCardProps {
  stock: Stock;
  horizontal?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, horizontal = false }) => (
  <TouchableOpacity 
    style={horizontal ? styles.trendingCard : styles.watchlistItem}
    activeOpacity={0.7}
  >
    {horizontal ? (
      <>
        <View style={styles.trendingHeader}>
          <View style={[styles.stockIcon, { backgroundColor: stock.color }]}>
            <Text style={styles.stockIconText}>{stock.symbol.charAt(0)}</Text>
          </View>
          <Text style={styles.trendingSymbol}>{stock.symbol}</Text>
        </View>
        <Text style={styles.trendingPrice}>{stock.price.toLocaleString()}</Text>
        <Text style={styles.trendingChange}>
          +{stock.change} (+{stock.changePercent}%)
        </Text>
      </>
    ) : (
      <>
        <View style={styles.watchlistLeft}>
          <View style={[styles.stockIcon, { backgroundColor: stock.color }]}>
            <Text style={styles.stockIconText}>{stock.symbol.charAt(0)}</Text>
          </View>
          <View style={styles.watchlistInfo}>
            <Text style={styles.watchlistSymbol}>{stock.symbol}</Text>
            <Text style={styles.watchlistName}>{stock.name}</Text>
          </View>
        </View>
        <View style={styles.watchlistRight}>
          <Text style={styles.watchlistPrice}>{stock.price.toLocaleString()}</Text>
          <Text style={[
            styles.watchlistChange,
            { color: stock.positive ? '#10B981' : '#EF4444' }
          ]}>
            {stock.positive ? '+' : ''}{stock.change} ({stock.positive ? '+' : ''}{stock.changePercent}%)
          </Text>
        </View>
      </>
    )}
  </TouchableOpacity>
);

export default StockCard;

const styles = StyleSheet.create({
  trendingCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 16,
    width: 120,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stockIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockIconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  trendingSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  trendingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  trendingChange: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  watchlistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  watchlistName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  watchlistRight: {
    alignItems: 'flex-end',
  },
  watchlistPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  watchlistChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});
