import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NewsHeadlines } from '../constants/DummyData';

const NewsSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>News</Text>
      <View style={styles.newsContainer}>
        {NewsHeadlines.map((newsItem) => (
          <View key={newsItem.id} style={styles.newsCard}>
            <Text style={styles.newsTitle}>{newsItem.title}</Text>
            <Text style={styles.newsSource}>{newsItem.source} - {newsItem.timestamp}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default NewsSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newsContainer: {
    paddingHorizontal: 20,
  },
  newsCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  newsSource: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});