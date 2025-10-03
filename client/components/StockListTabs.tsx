import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useStockData } from '../hooks/useStockData';
import { MarketIndex } from '@/types/api';
import { Stock } from '@/types/Stock';

interface StockItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  color : string
}

const transformMarketIndexToStock = (index: MarketIndex): Stock => {
  const isPositive = index.change >= 0;
  
  // Generate a color based on the index symbol for consistency
  const colors = ['#FF9500', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#06B6D4'];
  const colorIndex = Math.abs(index.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  
  return {
    symbol: index.symbol,
    name: index.name,
    price: index.price, // MarketIndex uses 'value' property
    change: index.change,
    changePercent: index.changePercent,
    color: colors[colorIndex],
    positive: isPositive,
  };
};

const StockItem: React.FC<StockItemProps> = ({ symbol, name, price, changePercent, color }) => {
  const changeColor = changePercent > 0 ? '#10B981' : '#EF4444';
  return (
    <View style={styles.stockItem}>
      <View style={styles.stockIconCircle}>
        <View style={[styles.stockIcon, { backgroundColor: color }]}>
          <Text style={styles.stockIconText}>{name.charAt(0)}</Text>
        </View>
        <View style={{flex : 1}}>
          <Text style={styles.stockTicker}>{symbol}</Text>
          <Text style={styles.stockExchange}>{name}</Text>
        </View>
      </View>
      <View style={styles.stockPriceChange}>
        <Text style={styles.stockPrice}>${price.toFixed(2)}</Text>
        <Text style={[styles.stockChange, { color: changeColor }]}>
          {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
};

interface StockListProps {
  endpoint: 'gainers' | 'losers' | 'active';
}

const StockList: React.FC<StockListProps> = ({ endpoint }) => {
  const { data, loading, error, refetch, loadMore, hasMore } = useStockData(endpoint);

  const transformedStocks = data?.map(transformMarketIndexToStock) || [];

  if (loading.isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading stock data...</Text>
      </View>
    );
  }

  if (error.hasError && !data) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>⚠️</Text>
        </View>
        <Text style={styles.errorText}>Unable to load stock data</Text>
        <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={loading.isRefreshing}
          onRefresh={refetch}
          colors={['#10B981']}
          tintColor="#10B981"
        />
      }
    >
      {error.hasError && data && error.errorMessage?.includes('demo data') && (
        <View style={styles.demoDataBanner}>
          <Text style={styles.demoDataText}>📊 Demo Mode</Text>
          <Text style={styles.demoDataSubtext}>Backend server not running - showing sample data</Text>
        </View>
      )}
      {transformedStocks?.map((stock, index) => (
        <StockItem key={`${stock.symbol}-${index}`} {...stock} />
      ))}
      {hasMore && (
        <TouchableOpacity
          onPress={loadMore}
          style={[styles.viewMoreButton, loading.isLoadingMore && styles.viewMoreButtonDisabled]}
          disabled={loading.isLoadingMore}
        >
          {loading.isLoadingMore ? (
            <View style={styles.loadingButtonContent}>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.viewMoreButtonText}>Loading...</Text>
            </View>
          ) : (
            <Text style={styles.viewMoreButtonText}>View More</Text>
          )}
        </TouchableOpacity>
      )}
      {error.hasError && data && !error.errorMessage?.includes('demo data') && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load more data</Text>
          <Text style={styles.errorSubtext}>Check your connection and try again</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const ActivelyTradingRoute = () => <StockList endpoint="active" />;
const TopLosersRoute = () => <StockList endpoint="losers" />;
const TopGainersRoute = () => <StockList endpoint="gainers" />;

const initialLayout = { width: Dimensions.get('window').width };

const StockListTabs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'activelyTrading', title: 'Most Active' },
    { key: 'topLosers', title: 'Top Losers' },
    { key: 'topGainers', title: 'Top Gainers' },
  ]);

  const renderScene = SceneMap({
    activelyTrading: ActivelyTradingRoute,
    topLosers: TopLosersRoute,
    topGainers: TopGainersRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={'#10B981'}
      inactiveColor={'#9CA3AF'}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
      style={styles.container}
    />
  );
};

export default StockListTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  stockIconCircle : {
    flex : 1, 
    flexDirection : "row", 
    gap : 15, 
    alignItems : "center"
  },
  stockIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockIconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stockTicker: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  stockExchange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stockPriceChange: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  stockChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewMoreButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorIconText: {
    fontSize: 48,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewMoreButtonDisabled: {
    opacity: 0.7,
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoDataBanner: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  demoDataText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  demoDataSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  tabBar: {
    backgroundColor: '#1F2937',
  },
  tabIndicator: {
    backgroundColor: '#10B981',
    height: 3,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});
