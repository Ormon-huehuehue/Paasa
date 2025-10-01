import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface NavItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onPress }) => {
  const scale = useSharedValue(isActive ? 1 : 0.95);
  const iconScale = useSharedValue(isActive ? 1 : 0.9);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1 : 0.95, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });

    iconScale.value = withTiming(isActive ? 1 : 0.9, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });

    translateY.value = withTiming(isActive ? 0 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    setTimeout(() => {
      scale.value = withTiming(1, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    }, 100);
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[styles.navItem, animatedContainerStyle]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Animated.View style={animatedIconStyle}>
        <Ionicons name={icon} size={24} color={isActive ? '#10B981' : '#9CA3AF'} />
      </Animated.View>
      <Text style={[styles.navText, isActive && styles.navTextActive]}>{label}</Text>
    </AnimatedTouchable>
  );
};

const BottomNavigation: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const activeIndex = state.index;
  const indicatorX = useSharedValue(0);

  const navItems = [
    { route: 'explore', icon: 'bar-chart' as const, label: 'Explore' },
    { route: 'stocks', icon: 'trending-up-outline' as const, label: 'Trending' },
    { route: 'news', icon: 'newspaper' as const, label: 'News' },
    { route: 'funds', icon: 'cash' as const, label: 'Funds' },
  ];
  const tabWidth = 100 / navItems.length;

  useEffect(() => {
    indicatorX.value = withTiming(activeIndex * tabWidth, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorX.value}%`,
    width: `${tabWidth}%`,
  }));


  return (
    <View style={styles.bottomNav}>
      <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
      {navItems.map((item, index) => (
        <NavItem
          key={item.route}
          icon={item.icon}
          label={item.label}
          isActive={activeIndex === index}
          onPress={() => {
            navigation.navigate(item.route);
          }}
        />
        
      ))}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingBottom: 20,
    paddingTop: 12,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
});
