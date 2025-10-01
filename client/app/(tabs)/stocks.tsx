import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StockListTabs from '../../components/StockListTabs';

export default function StocksScreen() {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <StockListTabs />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
