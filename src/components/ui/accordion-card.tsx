import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = { title: string; subtitle?: string; defaultOpen?: boolean; children: ReactNode };

export function AccordionCard({ title, subtitle, defaultOpen = false, children }: Props) {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View className="overflow-hidden rounded-3xl border border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
      <Pressable
        onPress={() => setOpen((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        className="min-h-14 flex-row items-center gap-3 px-5 py-4 active:opacity-80"
      >
        <View className="flex-1 gap-0.5">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{title}</Text>
          {subtitle ? (
            <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {open ? (
          <ChevronUp size={20} color={colors.primary} />
        ) : (
          <ChevronDown size={20} color={colors.primary} />
        )}
      </Pressable>
      {open ? <View className="gap-3 px-5 pb-5">{children}</View> : null}
    </View>
  );
}