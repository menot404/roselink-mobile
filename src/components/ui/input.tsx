import type { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = TextInputProps & { label: string; icon?: LucideIcon; error?: string };

export function Input({ label, icon: Icon, error, onFocus, onBlur, ...rest }: Props) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.alert : focused ? colors.primary : colors.border;

  return (
    <View className="gap-1.5">
      <Text className="font-jakarta-semibold text-sm text-ink dark:text-ink-dark">{label}</Text>
      <View
        style={{ borderColor, borderWidth: focused ? 2 : 1 }}
        className="min-h-14 flex-row items-center gap-3 rounded-2xl bg-surface px-4 dark:bg-surface-dark"
      >
        {Icon ? <Icon size={20} color={focused ? colors.primary : colors.inkSoft} /> : null}
        <TextInput
          {...rest}
          accessibilityLabel={label}
          placeholderTextColor={colors.inkSoft}
          selectionColor={colors.primary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontFamily: "PlusJakartaSans_500Medium",
            fontSize: 16,
            color: colors.ink,
            paddingVertical: 12,
          }}
        />
      </View>
      {error ? (
        <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">{error}</Text>
      ) : null}
    </View>
  );
}