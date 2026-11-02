import { Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

export function Bullet({ children }: { children: string }) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-row items-start gap-3">
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          marginTop: 9,
          backgroundColor: colors.primary,
        }}
      />
      <Text className="flex-1 font-jakarta text-base leading-6 text-ink dark:text-ink-dark">
        {children}
      </Text>
    </View>
  );
}