import { Moon, Smartphone, Sun, type LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useAppTheme, type ThemePreference } from "@/context/theme-context";

const OPTIONS: { value: ThemePreference; label: string; Icon: LucideIcon }[] = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Auto", Icon: Smartphone },
];

export function ThemeSwitcher() {
  const { preference, setPreference, colors } = useAppTheme();

  return (
    <View className="flex-row gap-1 rounded-2xl bg-primary-soft p-1 dark:bg-primary-soft-dark">
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = preference === value;
        return (
          <Pressable
            key={value}
            onPress={() => setPreference(value)}
            accessibilityRole="button"
            accessibilityLabel={`Thème ${label}`}
            accessibilityState={{ selected }}
            className={`min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl ${
              selected ? "bg-primary dark:bg-primary-dark" : ""
            }`}
          >
            <Icon size={18} color={selected ? colors.onPrimary : colors.inkSoft} />
            <Text
              className={`font-jakarta-semibold text-sm ${
                selected
                  ? "text-on-primary dark:text-on-primary-dark"
                  : "text-ink-soft dark:text-ink-soft-dark"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}