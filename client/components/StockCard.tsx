import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stock } from '../types/Stock';

interface StockCardProps {
  stock: Stock;
  horizontal?: boolean;
}

const truncateStockName = (stockName: string, maxLength: number): string => {
    // Check if the input name is already shorter than or equal to the maximum allowed length.
    if (stockName.length <= maxLength) {
        return stockName;
    }

    // Since we need to append "..." (3 characters), we slice the original string
    // to be maxLength - 3 characters long.
    const sliceLength = maxLength - 2;
    
    // Ensure the slice length is not negative (in case maxLength is < 3).
    if (sliceLength <= 0) {
        // If maxLength is too small, just return a truncated string of length maxLength
        // (This behavior can be adjusted, but this is a safe default).
        return stockName.slice(0, maxLength); 
    }

    // Truncate the string and append the ellipsis
    return stockName.slice(0, sliceLength) + '..';
};

function truncateToDecimals(num : number, decimals : number) {
    const factor = Math.pow(10, decimals);
    
    // 1. Shift the decimal point (e.g., 1.239 * 100 = 123.9)
    // 2. Truncate to remove the remaining fraction (e.g., Math.trunc(123.9) = 123)
    // 3. Shift the decimal back (e.g., 123 / 100 = 1.23)
    return Math.trunc(num * factor) / factor;
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
            <Text style={styles.stockIconText}>{stock.name.charAt(0)}</Text>
          </View>
          <Text style={styles.trendingSymbol}>{truncateStockName(stock.name, 10)}</Text>
        </View>
        <Text style={styles.trendingPrice}>{stock.price.toLocaleString()}</Text>
        <Text style={styles.trendingChange}>
          +{truncateToDecimals(stock.change, 2)} (+{truncateToDecimals(stock.changePercent, 2)}%)
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
    width: 170,
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
