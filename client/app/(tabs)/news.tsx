import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
          <Text style={styles.newsItem}>- Stock Market Rebounds Strongly</Text>
          <Text style={styles.newsItem}>- Tech Innovations Driving Growth</Text>
          <Text style={styles.newsItem}>- Global Economy Outlook Improves</Text>
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  newsItem: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});
