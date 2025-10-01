import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BalanceSection from '../../components/BalanceSection';

const ProfileScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BalanceSection />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {/* Add more profile details here */}
          <Text style={styles.profileText}>Name: John Doe</Text>
          <Text style={styles.profileText}>Email: john.doe@example.com</Text>
          <Text style={styles.profileText}>Member Since: January 2023</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  profileText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});
