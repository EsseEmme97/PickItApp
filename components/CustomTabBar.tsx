import Feather from '@expo/vector-icons/Feather';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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

const icons= ["home", "list","plus-circle","shopping-bag"];

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  /** posizione animata del background */
  const translateX = useSharedValue(0);
  const bgWidth = useSharedValue(48);

  // keep track of measured layouts for rendered (visible) tabs
  const [layouts, setLayouts] = useState<{ x: number; width: number }[]>([]);

  // compute visible routes (we hide the route 'lists/[id]')
  const visibleRoutes = state.routes.filter((r) => r.name !== 'lists/[id]');

  // find the index of the active route among visible routes
  const activeKey = state.routes[state.index]?.key;
  const visualIndex = Math.max(0, visibleRoutes.findIndex((r) => r.key === activeKey));

  // when active index or layouts change, animate bg to the measured position
  useEffect(() => {
    const layout = layouts[visualIndex];
    if (layout) {
      bgWidth.value = withSpring(layout.width);
      translateX.value = withSpring(layout.x + 20);
    }
  }, [visualIndex, layouts]);

  const animatedBgStyle = useAnimatedStyle(() => ({
    width: bgWidth.value,
    borderRadius: bgWidth.value / 2,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bgAnimation, animatedBgStyle]} />

      {visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label = options.tabBarLabel ?? options.title ?? route.name;

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
          top: withSpring(interpolate(progress.value, [0, 1], [0, 11])),
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

        const onLayout = (e: any) => {
          const { x, width } = e.nativeEvent.layout;
          setLayouts((prev) => {
            const copy = [...prev];
            copy[index] = { x:x-20, width };
            return copy;
          });

          // If this is the focused item, immediately animate bg to it
          if (isFocused) {
            bgWidth.value = withSpring(width);
            translateX.value = withSpring(x);
          }
        };

        return (
          <AnimatedPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            onPress={onPress}
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.button}
            onLayout={onLayout}
          >
            <Animated.View style={iconStyle}>
              <Feather
                name={icons[index] as any}
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
    backgroundColor: Colors.VERDE,
  },
});
