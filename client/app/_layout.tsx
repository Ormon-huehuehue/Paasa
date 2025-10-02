import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InterRegular: require('../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf'),
    InterBold: require('../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf'),
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RootLayoutNav />
      {showSplash && (
        <AnimatedSplashScreen onAnimationFinish={handleSplashFinish} />
      )}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: '#0B0F1A', paddingTop: insets.top }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}