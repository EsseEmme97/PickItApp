import { View, StyleSheet } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from "@/constants/Colors";
import Feather from '@expo/vector-icons/Feather';
import { createAnimatedComponent, useSharedValue, interpolate, useAnimatedStyle, interpolateColor, withSpring } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';


export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const AnimatedPlatformPressable = createAnimatedComponent(PlatformPressable);
  const translateX = useSharedValue(0);

  const animatedBgStyle= useAnimatedStyle(()=>{
    return {
      transform:[{translateX: translateX.value}]
    }
  })

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bgAnimation,animatedBgStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (route.name === "lists/[id]") {
          return;
        } // Skip rendering this tab


        const isFocused = state.index === index;

        const progress = useSharedValue(0);

        progress.value = isFocused ? 1 : 0;

        const textOpacityStyle = useAnimatedStyle(() => {
          const opacity = interpolate(progress.value, [0, 1], [1, 0]);
          return { opacity };
        });

        const iconAnimationStyle = useAnimatedStyle(() => {
          const scale = interpolate(progress.value, [0, 1], [1, 1.2]);
          const top = interpolate(progress.value,[0,1],[0,9]);
          return {
            transform: [{ scale: withSpring(scale) }],
            top: withSpring(top),
          }
        })

        const onPress = () => {
          translateX.value= withSpring(index * 67)
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <AnimatedPlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.button]}
          >
            <Animated.View style={[iconAnimationStyle]}>
              <Feather name={route.name === "index" ? "home" : "list"} size={24} color={isFocused ? Colors.BIANCO : "black"} />
            </Animated.View>
            <Animated.Text style={[styles.textButton, textOpacityStyle]}>
              {label as string}
            </Animated.Text>
          </AnimatedPlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    borderRadius: 30,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    backgroundColor: Colors.BIANCO
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    gap: 5,
    padding: 10
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Quicksand_400Regular"
  },
  bgAnimation:{
    position:"absolute",
    width: 48,
    height:48,
    top:20,
    bottom:10,
    borderRadius:24,
    backgroundColor: Colors.VERDE,
  }
})