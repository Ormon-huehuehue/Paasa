import { FontAwesome, Ionicons } from '@expo/vector-icons';
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
  isCenter?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onPress, isCenter = false }) => {
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

    translateY.value = withTiming(isActive && !isCenter ? 0 : 0, {
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

  if (isCenter) {
    return (
      <AnimatedTouchable
        style={[styles.navItem, animatedContainerStyle]}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Animated.View style={[styles.navCenterIcon, animatedIconStyle]}>
          <Ionicons name={icon} size={28} color="#1F2937" />
        </Animated.View>
        <Text style={styles.navText}>{label}</Text>
      </AnimatedTouchable>
    );
  }

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
    { route: 'index', icon: 'bar-chart' as const, label: 'Explore' },
    { route: 'stocks', icon: 'trending-up-outline' as const, label: 'Stocks' },
    { route: 'search', icon: 'search' as const, label: 'search', isCenter: true },
    { route: 'market', icon: 'newspaper' as const, label: 'news' },
    { route: 'profile', icon: 'person-outline' as const, label: 'Profil' },
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
      <FontAwesome name="hacker-news" size={24} color="black" />
      {navItems.map((item, index) => (
        <NavItem
          key={item.route}
          icon={item.icon}
          label={item.label}
          isActive={activeIndex === index}
          isCenter={item.isCenter}
          onPress={() => {
            if (item.route === 'topup') {
              console.log('Top Up');
            } else if (item.route === 'market') {
              console.log('Pasar');
            } else if (item.route === 'profile') {
              console.log('Profil');
            } else {
              navigation.navigate(item.route);
            }
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
  navCenterIcon: {
    backgroundColor: '#FFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 4,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
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
