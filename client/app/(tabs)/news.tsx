import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const NewsScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Header heading="Latest news" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.section}>
          <NewsSection enablePagination={true} limit={5} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    marginTop: 15
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: 16,
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20
  },
  newsItem: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});
