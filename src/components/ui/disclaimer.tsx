import { Info } from "lucide-react-native";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

export function Disclaimer() {
  const { colors } = useAppTheme();
  return (
    <View className="flex-row items-start gap-2 rounded-xl bg-primary-soft p-3 dark:bg-primary-soft-dark">
      <Info size={18} color={colors.primary} />
      <Text className="flex-1 font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
        RoseLink informe et oriente. Elle ne remplace pas un professionnel de santé.
      </Text>
    </View>
  );
}
