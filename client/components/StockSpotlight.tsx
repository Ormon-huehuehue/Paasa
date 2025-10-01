import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { StockSpotlightData } from '../constants/DummyData';


const StockSpotlight: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stock Spotlight</Text>

      <View style={styles.spotlightCard}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: StockSpotlightData.logo }} style={styles.companyLogo} />
        </View>

        <Text style={styles.companyName}>{StockSpotlightData.name}</Text>
        <Text style={styles.companyTicker}>{StockSpotlightData.ticker}</Text>
        <Text style={styles.companyDescription}>{StockSpotlightData.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${StockSpotlightData.price.toFixed(2)}</Text>
          <View style={[
            styles.changeBadge,
            StockSpotlightData.change > 0 ? styles.positiveChange : styles.negativeChange
          ]}>
            <Text style={styles.changeText}>
              {StockSpotlightData.change > 0 ? '+' : ''}{StockSpotlightData.change.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StockSpotlight;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  spotlightCard: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#10B981', // subtle accent glow
  },
  companyLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  companyTicker: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  companyDescription: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  positiveChange: {
    backgroundColor: '#064E3B',
  },
  negativeChange: {
    backgroundColor: '#7F1D1D',
  },
});
