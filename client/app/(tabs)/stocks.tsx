import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StockListTabs from '../../components/StockListTabs';
import Header from '@/components/Header';

export default function StocksScreen() {
  return (
    <LinearGradient
      colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <Header heading="Stocks"/>
      <StockListTabs />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
