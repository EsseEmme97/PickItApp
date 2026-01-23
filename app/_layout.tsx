import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Quicksand_400Regular } from '@expo-google-fonts/quicksand/400Regular';
import CustomTabBar from '@/components/CustomTabBar';
import { Colors } from '@/constants/Colors';


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

const headerOptions = {
  headerStyle: {
    backgroundColor: Colors.BIANCO,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitleStyle: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 20,
    color: "black",
  }
}

function RootLayoutNav() {

  return (
    <Tabs tabBar={props => <CustomTabBar {...props} />} screenOptions={headerOptions}>
      <Tabs.Screen name="index" options={{ title: "home" }} />
      <Tabs.Screen name="lists/index" options={{ title: "liste" }} />
      <Tabs.Screen name="lists/[id]" options={{ title: "singola lista", href: null }} />
      <Tabs.Screen name="newList" options={{ title: "nuovo" }} />
      <Tabs.Screen name="Costs" options={{ title: "spese" }} />
    </Tabs>
  );
}
