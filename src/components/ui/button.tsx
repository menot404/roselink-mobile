import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Variant = "primary" | "secondary" | "ghost";
type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  disabled?: boolean;
};

const STYLES: Record<Variant, { box: string; text: string }> = {
  primary: {
    box: "bg-primary dark:bg-primary-dark",
    text: "text-on-primary dark:text-on-primary-dark",
  },
  secondary: {
    box: "bg-primary-soft dark:bg-primary-soft-dark",
    text: "text-primary dark:text-primary-dark",
  },
  ghost: { box: "", text: "text-primary dark:text-primary-dark" },
};

export function Button({ label, onPress, variant = "primary", icon: Icon, disabled }: Props) {
  const { colors } = useAppTheme();
  const style = STYLES[variant];
  const iconColor = variant === "primary" ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-2xl px-5 active:opacity-80 ${style.box} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {Icon ? <Icon size={20} color={iconColor} /> : null}
      <Text className={`font-jakarta-bold text-base ${style.text}`}>{label}</Text>
    </Pressable>
  );
}