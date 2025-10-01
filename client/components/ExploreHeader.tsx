import Colors from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

export default function ExploreHeader() {
  return (
    <Animated.View style={styles.headerContainer}>
      <Text style={styles.title}>Explore</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/40' }} // Placeholder profile icon
        style={styles.profileIcon}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor : "#374151",
    borderBottomWidth : 1,
    elevation: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.light.tint, // Placeholder background
  },
});
