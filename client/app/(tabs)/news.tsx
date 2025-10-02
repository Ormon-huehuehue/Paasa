import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const NewsScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={{flex : 1}}
    >
      <Header heading="Latest news"/>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.section}>
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
    paddingVertical: 5,
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
