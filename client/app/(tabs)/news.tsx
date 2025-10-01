import NewsSection from '@/components/NewsSection';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const NewsScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          {/* News articles will go here */}
          <NewsSection/>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: 16,
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal : 20
  },
  newsItem: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});
