import { Navigation, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { useAppTheme } from "@/context/theme-context";
import { formatDistance } from "@/lib/geo";
import type { Center } from "@/types/center";

import { openDirections } from "./actions";

type Props = { center: Center; distanceKm: number | null; onClose: () => void };

export function MapInfoCard({ center, distanceKm, onClose }: Props) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 rounded-2xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text
            numberOfLines={2}
            className="font-jakarta-bold text-base text-ink dark:text-ink-dark"
          >
            {center.name}
          </Text>
          <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
            {center.type === "mobile" ? "Clinique mobile" : "Centre fixe"}
            {distanceKm !== null ? ` · ${formatDistance(distanceKm)}` : ""}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          hitSlop={10}
          className="h-9 w-9 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark"
        >
          <X size={18} color={colors.primary} />
        </Pressable>
      </View>
      <Button label="Itinéraire" icon={Navigation} onPress={() => openDirections(center)} />
    </View>
  );
}