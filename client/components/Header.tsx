import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function Header({heading} : {heading : string}) {
  return (
    <Animated.View style={styles.headerContainer}>
      <Text style={styles.title}>{heading}</Text>
      <View style={styles.profileCircle}>
        <Feather name="user" size={24} color="white" />
      </View>
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
  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1F2937",   // dark gray background
    borderWidth: 2,
    borderColor: "#10B981",      // green accent border
    justifyContent: 'center',
    alignItems: 'center',
  },
});
