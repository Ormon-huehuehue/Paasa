import Pagination from '@/components/Pagination';
import SlideItem from '@/components/SlideItem';
import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import Slides from "../constants/Slides";

const Slider = () => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = (event: any) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={Slides}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View style={styles.paginationContainer}>
        <Pagination data={Slides} scrollX={scrollX} index={index} />
      </View>
      <Link href="/explore" asChild>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore App</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 80, // Adjust this value as needed
    alignSelf: 'center',
  },
  exploreButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    justifyContent: 'center'
  },
});
