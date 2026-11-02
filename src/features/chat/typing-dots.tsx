import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

/** Trois points qui pulsent : « RoseLink est en train d'écrire ». */
export function TypingDots() {
  const { colors } = useAppTheme();
  const values = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const loops = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 160),
          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay((2 - index) * 160),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [values]);

  return (
    <View
      accessible
      accessibilityLabel="RoseLink est en train d'écrire"
      style={{ flexDirection: "row", gap: 6, paddingVertical: 6, paddingHorizontal: 4 }}
    >
      {values.map((value, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
            opacity: value,
          }}
        />
      ))}
    </View>
  );
}
