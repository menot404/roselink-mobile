import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

import { IconBadge } from "./icon-badge";

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onPress?: () => void;
};

export function HubCard({ title, subtitle, icon, onPress }: Props) {
  const { colors } = useAppTheme();
  const available = Boolean(onPress);

  return (
    <Pressable
      onPress={onPress}
      disabled={!available}
      accessibilityRole="button"
      accessibilityLabel={available ? `${title}. ${subtitle}` : `${title}, bientôt disponible`}
      accessibilityState={{ disabled: !available }}
      className={`flex-row items-center gap-4 rounded-3xl border border-line bg-surface p-4 active:opacity-80 dark:border-line-dark dark:bg-surface-dark ${
        available ? "" : "opacity-60"
      }`}
    >
      <IconBadge icon={icon} size={52} />
      <View className="flex-1 gap-0.5">
        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{title}</Text>
        <Text className="font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          {subtitle}
        </Text>
      </View>
      {available ? (
        <ChevronRight size={22} color={colors.primary} />
      ) : (
        <View className="rounded-full bg-primary-soft px-2.5 py-1 dark:bg-primary-soft-dark">
          <Text className="font-jakarta-semibold text-[11px] text-primary dark:text-primary-dark">
            Bientôt
          </Text>
        </View>
      )}
    </Pressable>
  );
}