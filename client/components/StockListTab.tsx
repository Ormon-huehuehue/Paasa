import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

interface StockItem {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
}

interface StockListTabProps {
  data: StockItem[];
}

const ITEMS_PER_LOAD = 5;

export default function StockListTab({ data }: StockListTabProps) {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_LOAD, data.length));
  };

  return (
    <View style={styles.container}>
      {data.slice(0, visibleItems).map((stock, index) => (
        <Animated.View
          key={stock.ticker + index}
          entering={FadeInUp.delay(index * 70).duration(500)}
          exiting={FadeOutDown.duration(300)}
          style={styles.stockItem}
        >
          <View style={styles.stockInfoLeft}>
            <Text style={styles.stockTicker}>{stock.ticker}</Text>
            <Text style={styles.stockExchange}>{stock.exchange}</Text>
          </View>
          <View style={styles.stockInfoRight}>
            <Text style={styles.stockPrice}>{stock.price.toFixed(2)}</Text>
            <Text style={[
              styles.stockChange,
              { color: stock.change >= 0 ? Colors.light.green : Colors.light.red }
            ]}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </Text>
          </View>
        </Animated.View>
      ))}
      {visibleItems < data.length && (
        <TouchableOpacity onPress={loadMore} style={styles.viewMoreButton} activeOpacity={0.7}>
          <Text style={styles.viewMoreButtonText}>View More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.light.cardBackground,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  stockInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockTicker: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 10,
  },
  stockExchange: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  stockInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 10,
  },
  stockChange: {
    fontSize: 15,
    fontWeight: '600',
  },
  viewMoreButton: {
    backgroundColor: Colors.light.tint,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  viewMoreButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
