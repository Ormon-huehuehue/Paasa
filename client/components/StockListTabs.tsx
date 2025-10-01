import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ActivelyTrading, TopGainers, TopLosers } from '../constants/DummyData';

interface StockItemProps {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
}

const StockItem: React.FC<StockItemProps> = ({ ticker, exchange, price, change }) => {
  const changeColor = change > 0 ? '#10B981' : '#EF4444';
  return (
    <View style={styles.stockItem}>
      <View>
        <Text style={styles.stockTicker}>{ticker}</Text>
        <Text style={styles.stockExchange}>{exchange}</Text>
      </View>
      <View style={styles.stockPriceChange}>
        <Text style={styles.stockPrice}>{price.toFixed(2)}</Text>
        <Text style={[styles.stockChange, { color: changeColor }]}>{change > 0 ? '+' : ''}{change.toFixed(2)}%</Text>
      </View>
    </View>
  );
};

interface StockListProps {
  data: StockItemProps[];
}

const StockList: React.FC<StockListProps> = ({ data }) => {
  const [displayCount, setDisplayCount] = useState(5);

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  return (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {data.slice(0, displayCount).map((stock, index) => (
        <StockItem key={index} {...stock} />
      ))}
      {displayCount < data.length && (
        <TouchableOpacity onPress={loadMore} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreButtonText}>View More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const ActivelyTradingRoute = () => <StockList data={ActivelyTrading} />;
const TopLosersRoute = () => <StockList data={TopLosers} />;
const TopGainersRoute = () => <StockList data={TopGainers} />;

const initialLayout = { width: Dimensions.get('window').width };

const StockListTabs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'activelyTrading', title: 'Actively Trading' },
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
    paddingVertical: 10,
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
