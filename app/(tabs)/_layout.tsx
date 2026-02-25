import { useAuthContext } from '@/components/auth/AuthProvider';
import CustomTabBar from '@/components/CustomTabBar';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const baseHeaderOptions = {
  headerStyle: {
    backgroundColor: Colors.BIANCO,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 50,
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

function LogOutButton({ onPress }: { onPress: () => void }) {
  return(
    <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={onPress}>
        <FontAwesome name="sign-out" size={20} color="black" />
    </TouchableOpacity>
  )
}

export default function TabsLayout() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuthContext();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <Tabs
      backBehavior='history'
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ navigation }) => ({
        ...baseHeaderOptions,
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerRightContainerStyle: { paddingRight: 12 },
        headerLeft: navigation.canGoBack() ? () => (
          <BackButton onPress={() => router.back()} />
        ) : undefined,
        headerRight: isAuthenticated ? () => (
          <LogOutButton onPress={handleLogout} />
        ) : undefined,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "home" }} />
      <Tabs.Screen name="lists/index" options={{ title: "liste" }} />
      <Tabs.Screen name="lists/[id]" options={{ title: "singola lista", href: null }} />
      <Tabs.Screen name="newList" options={{ title: "nuova" }} />
      <Tabs.Screen name="costs" options={{ title: "spese" }} />
    </Tabs>
  );
}
