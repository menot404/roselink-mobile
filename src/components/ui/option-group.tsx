import { Pressable, Text, View } from "react-native";

import type { Option } from "@/types/account";

type Props<T extends string> = {
  label: string;
  hint?: string;
  options: readonly Option<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  error?: string;
};

export function OptionGroup<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
  error,
}: Props<T>) {
  return (
    <View className="gap-2">
      <Text className="font-jakarta-semibold text-sm text-ink dark:text-ink-dark">{label}</Text>
      {hint ? (
        <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">{hint}</Text>
      ) : null}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              className={`min-h-11 justify-center rounded-full border px-4 active:opacity-80 ${
                selected
                  ? "border-primary bg-primary-soft dark:border-primary-dark dark:bg-primary-soft-dark"
                  : "border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
              }`}
            >
              <Text
                className={`font-jakarta-semibold text-sm ${
                  selected
                    ? "text-primary dark:text-primary-dark"
                    : "text-ink dark:text-ink-dark"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">{error}</Text>
      ) : null}
    </View>
  );
}