import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = { title: string; subtitle?: string; right?: ReactNode };

export function Header({ title, subtitle, right }: Props) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1 gap-1">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-[28px] leading-9 text-ink dark:text-ink-dark"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="font-jakarta text-base text-ink-soft dark:text-ink-soft-dark">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}