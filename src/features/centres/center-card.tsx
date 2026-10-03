import { Building2, Info, Navigation, Phone, Truck } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { useAppTheme } from "@/context/theme-context";
import { formatDistance } from "@/lib/geo";
import type { Center } from "@/types/center";

import { callCenter, openDirections } from "./actions";

type Props = {
  center: Center;
  distanceKm: number | null;
  selected: boolean;
  onPress: () => void;
};

function appointmentLabel(value: boolean | null) {
  if (value === null) return "Rendez-vous : à vérifier";
  return value ? "Rendez-vous nécessaire" : "Sans rendez-vous";
}

export function CenterCard({ center, distanceKm, selected, onPress }: Props) {
  const { colors } = useAppTheme();
  const isMobile = center.type === "mobile";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${center.name}, ${isMobile ? "clinique mobile" : "centre fixe"}${
        distanceKm !== null ? `, à ${formatDistance(distanceKm)}` : ""
      }`}
      accessibilityState={{ selected }}
      className={`gap-4 rounded-3xl border bg-surface p-4 active:opacity-90 dark:bg-surface-dark ${
        selected
          ? "border-2 border-primary dark:border-primary-dark"
          : "border-line dark:border-line-dark"
      }`}
    >
      <View className="flex-row items-start gap-3">
        <IconBadge icon={isMobile ? Truck : Building2} size={48} />
        <View className="flex-1 gap-1">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            {center.name}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-primary-soft px-2.5 py-0.5 dark:bg-primary-soft-dark">
              <Text className="font-jakarta-semibold text-[11px] text-primary dark:text-primary-dark">
                {isMobile ? "Clinique mobile" : "Centre fixe"}
              </Text>
            </View>
            {center.isExample ? (
              <View className="rounded-full border border-line px-2.5 py-0.5 dark:border-line-dark">
                <Text className="font-jakarta-semibold text-[11px] text-ink-soft dark:text-ink-soft-dark">
                  Exemple
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        {distanceKm !== null ? (
          <View className="rounded-full bg-primary px-3 py-1 dark:bg-primary-dark">
            <Text className="font-jakarta-bold text-xs text-on-primary dark:text-on-primary-dark">
              {formatDistance(distanceKm)}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-2">
        {center.services.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {center.services.map((service) => (
              <View
                key={service}
                className="rounded-full border border-line px-3 py-1 dark:border-line-dark"
              >
                <Text className="font-jakarta text-xs text-ink dark:text-ink-dark">{service}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
            Services à vérifier
          </Text>
        )}
        <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
          {center.cost ? `Coût : ${center.cost}` : "Coût : à vérifier"} ·{" "}
          {appointmentLabel(center.appointmentRequired)}
        </Text>
        {isMobile && center.nextMobileClinic ? (
          <Text className="font-jakarta-semibold text-sm text-ink dark:text-ink-dark">
            Prochaine sortie : {center.nextMobileClinic}
          </Text>
        ) : null}
        {!center.verified ? (
          <View className="flex-row items-center gap-1.5">
            <Info size={14} color={colors.inkSoft} />
            <Text className="flex-1 font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
              Informations à vérifier avant de vous déplacer.
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button label="Itinéraire" icon={Navigation} onPress={() => openDirections(center)} />
        </View>
        {center.phone ? (
          <View className="flex-1">
            <Button
              label="Appeler"
              icon={Phone}
              variant="secondary"
              onPress={() => callCenter(center)}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}