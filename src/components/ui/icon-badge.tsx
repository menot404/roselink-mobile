import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = { icon: LucideIcon; size?: number };

export function IconBadge({ icon: Icon, size = 44 }: Props) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-primary-soft dark:bg-primary-soft-dark"
    >
      <Icon size={size * 0.5} color={colors.primary} />
    </View>
  );
}