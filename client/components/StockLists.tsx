import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, FadeInUp } from 'react-native-reanimated';
import { TopGainers, TopLosers, ActivelyTrading } from '@/constants/DummyData';
import Colors from '@/constants/Colors';
import StockListTab from './StockListTab';

export default function StockLists() {
  const [activeTab, setActiveTab] = useState('Gainers');

  const renderContent = () => {
    switch (activeTab) {
      case 'Gainers':
        return <StockListTab data={TopGainers} />;
      case 'Losers':
        return <StockListTab data={TopLosers} />;
      case 'Active':
        return <StockListTab data={ActivelyTrading} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.container}>
      <Text style={styles.sectionTitle}>Stock Lists</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Gainers' && styles.activeTabButton]}
          onPress={() => setActiveTab('Gainers')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabButtonText, activeTab === 'Gainers' && styles.activeTabButtonText]}>Top Gainers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Losers' && styles.activeTabButton]}
          onPress={() => setActiveTab('Losers')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabButtonText, activeTab === 'Losers' && styles.activeTabButtonText]}>Top Losers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Active' && styles.activeTabButton]}
          onPress={() => setActiveTab('Active')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabButtonText, activeTab === 'Active' && styles.activeTabButtonText]}>Actively Trading</Text>
        </TouchableOpacity>
      </View>
      <Animated.View layout={Layout.springify()} entering={FadeIn} exiting={FadeOut}>
        {renderContent()}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingBottom: 5,
    marginHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  activeTabButton: {
    backgroundColor: Colors.light.tint,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondaryText,
  },
  activeTabButtonText: {
    color: Colors.light.background,
  },
});
