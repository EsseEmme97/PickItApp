import Feather from '@expo/vector-icons/Feather';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  createAnimatedComponent,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

const AnimatedPressable = createAnimatedComponent(PlatformPressable);
const TAB_OFFSET = 67;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  /** posizione animata del background */
  const translateX = useSharedValue(0);

  const visualIndex = state.index === 2 ? 1 : state.index;

  useEffect(() => {
    translateX.value = withSpring(visualIndex * TAB_OFFSET);
  }, [visualIndex]);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bgAnimation, animatedBgStyle]} />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (route.name === 'lists/[id]') return null;

        const label =
          options.tabBarLabel ??
          options.title ??
          route.name;

        const isFocused = visualIndex === index;

        const progress = useSharedValue(isFocused ? 1 : 0);
        progress.value = isFocused ? 1 : 0;

        const iconStyle = useAnimatedStyle(() => ({
          transform: [
            {
              scale: withSpring(
                interpolate(progress.value, [0, 1], [1, 1.2])
              ),
            },
          ],
          top: withSpring(
            interpolate(progress.value, [0, 1], [0, 9])
          ),
        }));

        const textStyle = useAnimatedStyle(() => ({
          opacity: interpolate(progress.value, [0, 1], [1, 0]),
        }));

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            onPress={onPress}
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.button}
          >
            <Animated.View style={iconStyle}>
              <Feather
                name={route.name === 'index' ? 'home' : 'list'}
                size={24}
                color={isFocused ? Colors.BIANCO : 'black'}
              />
            </Animated.View>

            <Animated.Text style={[styles.textButton, textStyle]}>
              {label as string}
            </Animated.Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    borderRadius: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    backgroundColor: Colors.BIANCO,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    gap: 5,
    padding: 10,
  },
  textButton: {
    fontSize: 12,
    fontFamily: 'Quicksand_400Regular',
  },
  bgAnimation: {
    position: 'absolute',
    width: 48,
    height: 48,
    top: 20,
    borderRadius: 24,
    backgroundColor: Colors.VERDE,
  },
});
