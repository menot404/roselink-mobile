import { Switch, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ToggleRow({ label, description, value, onValueChange }: Props) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-4">
      <View className="flex-1 gap-1">
        <Text className="font-jakarta-semibold text-base text-ink dark:text-ink-dark">{label}</Text>
        {description ? (
          <Text className="font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}