import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './Header';

const BalanceSection: React.FC = () => {
  return (
    <View>
      <Header heading = "Funds"/>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>Rs 200</Text>
        <View style={styles.balanceChange}>
          <Ionicons name="arrow-down" size={14} color="#d62323ff" />
          <Text style={styles.balanceChangeText}>Rs 400 (200%)</Text>
        </View>
      </View>
    </View>
  );
};

export default BalanceSection;

const styles = StyleSheet.create({
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceChangeText: {
    fontSize: 14,
    color: '#d62323ff',
    fontWeight: '300',
  },
});
