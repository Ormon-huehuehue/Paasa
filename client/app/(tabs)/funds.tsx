import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BalanceSection from '../../components/BalanceSection';

const ProfileScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BalanceSection />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {/* Add more profile details here */}
          <Text style={styles.profileText}>Name: Armaan Verma</Text>
          <Text style={styles.profileText}>Email: armnvrma10@gmail.com</Text>
          <Text style={styles.profileText}>Paasa Member Since: xyz 2025</Text>
        </View>
         {/* Dawg image and hire me section */}
        <View style={styles.hireMeSection}>
          <Image
            source={require('../../assets/images/dawg.png')}
            style={styles.dawgImage}
            resizeMode="contain"
          />
          <Text style={styles.hireMeText}>Hire me</Text>
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
  hireMeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dawgImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  hireMeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
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
