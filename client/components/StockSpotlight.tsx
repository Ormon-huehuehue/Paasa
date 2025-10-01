import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StockSpotlightData } from '@/constants/DummyData';
import Colors from '@/constants/Colors';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function StockSpotlight() {
  return (
    <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.container}>
      <Text style={styles.sectionTitle}>Stock Spotlight</Text>
      <View style={styles.spotlightCard}>
        <View style={styles.header}>
          <Image source={{ uri: StockSpotlightData.logo }} style={styles.companyLogo} />
          <View>
            <Text style={styles.companyName}>{StockSpotlightData.name}</Text>
            <Text style={styles.stockTicker}>{StockSpotlightData.ticker}</Text>
          </View>
        </View>
        <Text style={styles.description}>{StockSpotlightData.description}</Text>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>{StockSpotlightData.price.toFixed(2)}</Text>
          <Text style={[
            styles.priceChange,
            { color: StockSpotlightData.change >= 0 ? Colors.light.green : Colors.light.red }
          ]}>
            {StockSpotlightData.change >= 0 ? '+' : ''}{StockSpotlightData.change.toFixed(2)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  spotlightCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  stockTicker: {
    fontSize: 15,
    color: Colors.light.secondaryText,
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 15,
    lineHeight: 22,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 10,
  },
  priceChange: {
    fontSize: 17,
    fontWeight: '600',
  },
});
