import Colors from '@/constants/Colors';
import { MarketIndexes } from '@/constants/DummyData';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function MarketSnapshot() {
  return (
    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.container}>
      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <View style={styles.indexesContainer}>
        {MarketIndexes.map((index, i) => (
          <Animated.View key={i} entering={FadeInUp.delay(200 + i * 100).duration(600)} style={styles.indexCard}>
            <Text style={styles.indexName}>{index.name}</Text>
            <Text style={styles.indexValue}>{index.value.toFixed(2)}</Text>
            <Text style={[styles.indexChange, { color: index.change >= 0 ? Colors.light.green : Colors.light.red }]}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
            </Text>
          </Animated.View>
        ))}
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
  indexesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  indexCard: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    width: '31%', // Adjusted for better spacing with justifyContent: 'space-between'
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  indexName: {
    fontSize: 15,
    color: Colors.light.secondaryText,
    marginBottom: 6,
  },
  indexValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  indexChange: {
    fontSize: 15,
    fontWeight: '600',
  },
});
