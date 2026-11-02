import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { IconBadge } from "./icon-badge";

type Props = { title: string; subtitle: string; icon: LucideIcon; onPress: () => void };

export function ActionTile({ title, subtitle, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      className="min-h-36 flex-1 justify-between gap-4 rounded-3xl border border-line bg-surface p-4 active:opacity-80 dark:border-line-dark dark:bg-surface-dark"
    >
      <IconBadge icon={icon} />
      <View className="gap-0.5">
        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{title}</Text>
        <Text className="font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}