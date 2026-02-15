import CustomTabBar from '@/components/CustomTabBar';
import { Colors } from '@/constants/Colors';
import { Quicksand_400Regular } from '@expo-google-fonts/quicksand/400Regular';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Tabs, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
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

  return <RootLayoutNav />;
}

const baseHeaderOptions = {
  headerStyle: {
    backgroundColor: Colors.BIANCO,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height:70,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 6,
  },
  headerTitleAlign: "center" as const,
  headerTitleStyle: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    lineHeight: 20,
    color: "black",
    fontWeight: "bold",
  }
} as const;

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityLabel="Go back"
      onPress={onPress}
      style={{ paddingHorizontal: 12 }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <FontAwesome name="chevron-left" size={20} color="black" />
    </TouchableOpacity>
  );
}

function RootLayoutNav() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BIANCO }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BIANCO} />
      <Tabs
        backBehavior='history'
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={({ navigation }) => ({
          ...baseHeaderOptions,
          headerLeft: navigation.canGoBack() ? () => (
            <BackButton onPress={() => router.back()} />
          ) : undefined,
        })}
      >
        <Tabs.Screen name="index" options={{ title: "home" }} />
        <Tabs.Screen name="lists/index" options={{ title: "liste" }} />
        <Tabs.Screen name="lists/[id]" options={{ title: "singola lista", href: null }} />
        <Tabs.Screen name="newList" options={{ title: "nuova" }} />
        <Tabs.Screen name="costs" options={{ title: "spese" }} />
      </Tabs>
    </SafeAreaView>
  );
}
