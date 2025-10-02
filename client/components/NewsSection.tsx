import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNewsData } from '../hooks/useNewsData';

interface NewsSectionProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  enablePagination?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  limit,
  showTitle = false,
  title = 'Latest News',
  enablePagination = false
}) => {
  const { data: newsData, loading, error, refetch, loadMore, hasMore } = useNewsData(undefined, limit);

  const handleNewsPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Unable to open article',
          'This article cannot be opened on your device.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening news article:', error);
      Alert.alert(
        'Error',
        'Failed to open the article. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const displayedNews = newsData ? (limit ? newsData.slice(0, limit) : newsData) : [];

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (loading.isLoading || loading.isRefreshing) {
    return (
      <View style={styles.section}>
        {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#9CA3AF" />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      </View>
    );
  }

  if (error.hasError) {
    return (
      <View style={styles.section}>
        {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load news</Text>
          <Text style={styles.errorSubtext}>
            {error.errorMessage || 'Please check your connection and try again'}
          </Text>
          {error.isRetryable && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!displayedNews.length) {
    return (
      <View style={styles.section}>
        {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No news available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.newsContainer}>
        {displayedNews.map((newsItem, index) => (
          <TouchableOpacity
            key={newsItem.uuid || index}
            style={styles.newsCard}
            onPress={() => handleNewsPress(newsItem.url)}
            activeOpacity={0.7}
          >
            <Text style={styles.newsTitle}>{newsItem.title}</Text>
            {newsItem.summary && newsItem.summary.trim() && (
              <Text style={styles.newsSummary} numberOfLines={2}>
                {newsItem.summary}
              </Text>
            )}
            <Text style={styles.newsSource}>
              {newsItem.source} - {formatTimestamp(newsItem.publishedAt)}
            </Text>
          </TouchableOpacity>
        ))}
        
        {enablePagination && hasMore && !loading.isLoading && (
          <TouchableOpacity 
            style={styles.viewMoreButton} 
            onPress={loadMore}
            disabled={loading.isLoadingMore}
          >
            {loading.isLoadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#FFF" />
                <Text style={styles.viewMoreText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.viewMoreText}>View More</Text>
            )}
          </TouchableOpacity>
        )}
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
  newsSummary: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
    lineHeight: 20,
  },
  newsSource: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  errorContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  viewMoreText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});