import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = { index: number; title: string; description: string; icon: LucideIcon };

export function SignCard({ index, title, description, icon: Icon }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={`Signe ${index} : ${title}. ${description}`}
      className="flex-row gap-4 rounded-3xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft dark:bg-primary-soft-dark">
        <Icon size={24} color={colors.primary} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-jakarta-semibold text-xs text-primary dark:text-primary-dark">
          Signe {index}
        </Text>
        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{title}</Text>
        <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
          {description}
        </Text>
      </View>
    </View>
  );
}