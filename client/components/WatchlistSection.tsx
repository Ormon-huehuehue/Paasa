import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WatchlistSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Watchlist</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.watchlistContainer}>
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={48} color="#6B7280" />
          <Text style={styles.emptyStateTitle}>Your Watchlist is Empty</Text>
          <Text style={styles.emptyStateText}>
            Add stocks to your watchlist to track them here
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Stocks</Text>
          </TouchableOpacity>
        </View>
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});
