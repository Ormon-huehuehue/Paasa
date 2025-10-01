import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { NewsHeadlines } from '@/constants/DummyData';
import Colors from '@/constants/Colors';

const ITEMS_PER_LOAD = 3;

export default function NewsSection() {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_LOAD, NewsHeadlines.length));
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.container}>
      <Text style={styles.sectionTitle}>News Section</Text>
      <View>
        {NewsHeadlines.slice(0, visibleItems).map((news, index) => (
          <Animated.View
            key={news.id}
            entering={FadeInUp.delay(index * 80).duration(500)}
            exiting={FadeOutDown.duration(300)}
            style={styles.newsItem}
          >
            <TouchableOpacity onPress={() => openLink(news.url)} activeOpacity={0.7}>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <View style={styles.newsMeta}>
                <Text style={styles.newsSource}>{news.source}</Text>
                <Text style={styles.newsTimestamp}>{news.timestamp}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      {visibleItems < NewsHeadlines.length && (
        <TouchableOpacity onPress={loadMore} style={styles.viewMoreButton} activeOpacity={0.7}>
          <Text style={styles.viewMoreButtonText}>View More</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  newsItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  newsSource: {
    fontSize: 13,
    color: Colors.light.secondaryText,
  },
  newsTimestamp: {
    fontSize: 13,
    color: Colors.light.secondaryText,
  },
  viewMoreButton: {
    backgroundColor: Colors.light.tint,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  viewMoreButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
