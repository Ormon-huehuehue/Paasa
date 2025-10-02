import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSpotlightStock } from '../hooks/useSpotlightStock';

// Utility function to format market cap
const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
};


const StockSpotlight: React.FC = () => {
  // Use the spotlight hook to get API data
  const { data: spotlightStock, loading, error, refetch } = useSpotlightStock();
  
  // State for expand/collapse functionality
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useSharedValue(0);

  // Function to truncate description
  const truncateDescription = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to toggle expand/collapse
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    animatedHeight.value = withTiming(isExpanded ? 0 : 1, { duration: 300 });
  };

  // Animated style for smooth height transition
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded ? 1 : 0.7, { duration: 300 }),
    };
  });

  const renderContent = () => {
    // Loading state
    if (loading.isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading spotlight stock...</Text>
        </View>
      );
    }

    // Error state
    if (error.hasError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error.errorMessage}</Text>
          {error.isRetryable && (
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Data state
    if (spotlightStock) {
      return (
        <>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>{spotlightStock.symbol}</Text>
          </View>

          <Text style={styles.companyName}>{spotlightStock.name}</Text>
          <Text style={styles.companyTicker}>{spotlightStock.symbol}</Text>
          
          {/* Description with expand/collapse functionality */}
          <View style={styles.descriptionContainer}>
            <Animated.View style={animatedStyle}>
              <Text style={styles.companyDescription}>
                {isExpanded 
                  ? spotlightStock.description 
                  : truncateDescription(spotlightStock.description, 50)
                }
              </Text>
            </Animated.View>
            
            {spotlightStock.description.length > 50 && (
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={toggleExpanded}
                activeOpacity={0.7}
              >
                <Text style={styles.expandButtonText}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Optional fields display */}
          {(spotlightStock.sector || spotlightStock.industry) && (
            <View style={styles.metadataContainer}>
              {spotlightStock.sector && (
                <Text style={styles.metadataText}>Sector: {spotlightStock.sector}</Text>
              )}
              {spotlightStock.industry && (
                <Text style={styles.metadataText}>Industry: {spotlightStock.industry}</Text>
              )}
            </View>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${spotlightStock.price.toFixed(2)}</Text>
            <View style={[
              styles.changeBadge,
              spotlightStock.changePercent > 0 ? styles.positiveChange : styles.negativeChange
            ]}>
              <Text style={styles.changeText}>
                {spotlightStock.changePercent > 0 ? '+' : ''}{spotlightStock.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>

          {/* Additional metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>{formatMarketCap(spotlightStock.marketCap)}</Text>
            </View>
            {spotlightStock.peRatio && (
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>P/E Ratio</Text>
                <Text style={styles.metricValue}>{spotlightStock.peRatio.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </>
      );
    }

    // Fallback state
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.fallbackText}>No spotlight data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stock Spotlight</Text>
      <View style={styles.spotlightCard}>
        {renderContent()}
      </View>
    </View>
  );
};

export default StockSpotlight;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  spotlightCard: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#10B981', // subtle accent glow
  },
  companyLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  companyTicker: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  descriptionContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  companyDescription: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  expandButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  expandButtonText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  positiveChange: {
    backgroundColor: '#064E3B',
  },
  negativeChange: {
    backgroundColor: '#7F1D1D',
  },
  metadataContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    width: '100%',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  fallbackText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});
