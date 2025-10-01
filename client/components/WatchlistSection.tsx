import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StockCard from './StockCard';
import { watchlist } from '../constants/DummyData';

const WatchlistSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Watchlist Saya</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.watchlistContainer}>
        {watchlist.map((stock, index) => (
          <StockCard key={index} stock={stock} />
        ))}
      </View>
    </View>
  );
};

export default WatchlistSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  watchlistContainer: {
    paddingHorizontal: 20,
  },
});
