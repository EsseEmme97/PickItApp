import AuthProvider, { useAuthContext } from "@/components/auth/AuthProvider";
import { Colors } from '@/constants/Colors';
import { Quicksand_400Regular } from '@expo-google-fonts/quicksand/400Regular';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import type { RelativePathString } from 'expo-router';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Quicksand_400Regular,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BIANCO }}>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.BIANCO} />
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaView>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inAuthGroup) {
      // User is authenticated but on login screen -> redirect to tabs
      router.replace('/(tabs)' as RelativePathString);
    } else if (!isAuthenticated && inAuthGroup) {
      // User is not authenticated but inside tabs -> redirect to login
      router.replace('/login' as RelativePathString);
    }
  }, [isAuthenticated, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
