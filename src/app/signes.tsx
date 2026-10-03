import { useRouter } from "expo-router";
import {
  CircleDot,
  Droplets,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Scan,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";
import { useAppTheme } from "@/context/theme-context";
import { CONTENT_REVIEW, KEY_POINTS, SIGNS, type SignId } from "@/features/signes/data";
import { SignCard } from "@/features/signes/sign-card";

const ICONS: Record<SignId, LucideIcon> = {
  boule: CircleDot,
  forme: Maximize2,
  peau: Layers,
  mamelon: Target,
  ecoulement: Droplets,
  croute: Scan,
  douleur: Zap,
};

export default function Signes() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <Screen padTop={false}>
      <View className="gap-2">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
        >
          Connaître vos seins
        </Text>
        <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
          Repérer vite un changement, c'est le meilleur réflexe. Un changement ne veut pas dire
          cancer, mais il mérite d'être examiné par un professionnel de santé.
        </Text>
      </View>

      <SectionTitle>Les signes à connaître</SectionTitle>
      <View className="gap-3">
        {SIGNS.map((sign, i) => (
          <SignCard
            key={sign.id}
            index={i + 1}
            title={sign.title}
            description={sign.description}
            icon={ICONS[sign.id]}
          />
        ))}
      </View>

      <Card className="gap-3 bg-primary-soft dark:bg-primary-soft-dark">
        <View className="flex-row items-center gap-2">
          <Info size={20} color={colors.primary} />
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">À retenir</Text>
        </View>
        {KEY_POINTS.map((point) => (
          <View key={point} className="flex-row items-start gap-3">
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginTop: 8,
                backgroundColor: colors.primary,
              }}
            />
            <Text className="flex-1 font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
              {point}
            </Text>
          </View>
        ))}
      </Card>

      <Button
        label="Trouver un centre près de moi"
        icon={MapPin}
        onPress={() => router.push("/carte")}
      />

      <Text className="text-center font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
        {CONTENT_REVIEW.validated
          ? `Contenu validé par ${CONTENT_REVIEW.reviewer ?? "un professionnel de santé"}${
              CONTENT_REVIEW.reviewedAt ? ` le ${CONTENT_REVIEW.reviewedAt}` : ""
            }.`
          : "Contenu en cours de relecture par un professionnel de santé."}
      </Text>
      <Disclaimer />
    </Screen>
  );
}