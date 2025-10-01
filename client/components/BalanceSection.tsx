import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BalanceSection: React.FC = () => {
  return (
    <View style={styles.balanceSection}>
      <Text style={styles.balanceLabel}>Dana Utama</Text>
      <Text style={styles.balanceAmount}>Rp2.125.000</Text>
      <View style={styles.balanceChange}>
        <Ionicons name="arrow-up" size={14} color="#10B981" />
        <Text style={styles.balanceChangeText}>Rp206.920 (10,6%)</Text>
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
    color: '#10B981',
    fontWeight: '600',
  },
});
