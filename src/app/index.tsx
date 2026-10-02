import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useAppTheme } from "@/context/theme-context";

export default function Index() {
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 justify-center gap-5 bg-canvas p-6 dark:bg-canvas-dark">
      <View className="gap-1">
        <Text className="font-jakarta-bold text-3xl text-ink dark:text-ink-dark">
          RoseLink
        </Text>
        <Text className="font-jakarta text-base text-ink-soft dark:text-ink-soft-dark">
          Tu n'es pas seule.
        </Text>
      </View>

      <View className="rounded-2xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark">
        <Text className="font-jakarta-semibold text-lg text-ink dark:text-ink-dark">
          Thème de l'application
        </Text>
        <Text className="mb-4 mt-1 font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
          Clair, sombre, ou comme ton téléphone.
        </Text>
        <ThemeSwitcher />
      </View>

      <View className="min-h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-5 dark:bg-primary-dark">
        <Heart size={20} color={colors.onPrimary} />
        <Text className="font-jakarta-bold text-base text-on-primary dark:text-on-primary-dark">
          Bouton principal
        </Text>
      </View>
    </View>
  );
}