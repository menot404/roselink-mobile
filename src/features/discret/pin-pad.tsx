import { Delete } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

import { PIN_LENGTH } from "./pin";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
};

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

function Key({
  label,
  onPress,
  disabled,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: 72, height: 72, borderRadius: 36 }}
      className="items-center justify-center border border-line bg-surface active:opacity-70 dark:border-line-dark dark:bg-surface-dark"
    >
      {children}
    </Pressable>
  );
}

export function PinPad({ value, onChange, onComplete, disabled }: Props) {
  const { colors } = useAppTheme();

  const press = (digit: string) => {
    if (disabled || value.length >= PIN_LENGTH) return;
    const next = value + digit;
    onChange(next);
    if (next.length === PIN_LENGTH) onComplete(next);
  };

  const erase = () => {
    if (!disabled) onChange(value.slice(0, -1));
  };

  return (
    <View className="items-center gap-8">
      <View
        accessible
        accessibilityLabel={`${value.length} chiffre${value.length > 1 ? "s" : ""} saisi${
          value.length > 1 ? "s" : ""
        } sur ${PIN_LENGTH}`}
        className="flex-row gap-5"
      >
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: colors.primary,
              backgroundColor: i < value.length ? colors.primary : "transparent",
            }}
          />
        ))}
      </View>

      <View className="gap-4">
        {ROWS.map((row) => (
          <View key={row.join("")} className="flex-row gap-4">
            {row.map((digit) => (
              <Key key={digit} label={digit} onPress={() => press(digit)} disabled={disabled}>
                <Text className="font-jakarta-semibold text-[28px] text-ink dark:text-ink-dark">
                  {digit}
                </Text>
              </Key>
            ))}
          </View>
        ))}
        <View className="flex-row gap-4">
          <View style={{ width: 72, height: 72 }} />
          <Key label="0" onPress={() => press("0")} disabled={disabled}>
            <Text className="font-jakarta-semibold text-[28px] text-ink dark:text-ink-dark">0</Text>
          </Key>
          <Key label="Effacer le dernier chiffre" onPress={erase} disabled={disabled}>
            <Delete size={26} color={colors.inkSoft} />
          </Key>
        </View>
      </View>
    </View>
  );
}