import { useRouter } from "expo-router";
import { Headphones, MapPin, MessageCircleHeart, Settings, Stethoscope } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { ActionTile } from "@/components/ui/action-tile";
import { Disclaimer } from "@/components/ui/disclaimer";
import { HeroCard } from "@/components/ui/hero-card";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";
import { useAppTheme } from "@/context/theme-context";

export default function Accueil() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <View className="gap-0.5">
          <Text className="font-jakarta-medium text-sm text-ink-soft dark:text-ink-soft-dark">
            Bienvenue sur
          </Text>
          <Text className="font-jakarta-bold text-[28px] leading-9 text-primary dark:text-primary-dark">
            RoseLink
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/reglages")}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir les réglages"
          className="h-12 w-12 items-center justify-center rounded-full border border-line bg-surface active:opacity-80 dark:border-line-dark dark:bg-surface-dark"
        >
          <Settings size={22} color={colors.primary} />
        </Pressable>
      </View>

      <HeroCard
        eyebrow="Octobre Rose"
        title="Connais tes seins, prends soin de toi."
        text="Apprends à repérer les signes, trouve où te faire dépister et pose tes questions sans jugement."
        cta="Découvrir les signes"
        onPress={() => router.push("/parcours")}
      />

      <SectionTitle>Que veux-tu faire ?</SectionTitle>
      <View className="gap-3">
        <View className="flex-row gap-3">
          <ActionTile
            title="Signes d'alerte"
            subtitle="Reconnaître les changements"
            icon={Stethoscope}
            onPress={() => router.push("/parcours")}
          />
          <ActionTile
            title="Centres"
            subtitle="Où se faire dépister"
            icon={MapPin}
            onPress={() => router.push("/carte")}
          />
        </View>
        <View className="flex-row gap-3">
          <ActionTile
            title="Poser une question"
            subtitle="Sans jugement"
            icon={MessageCircleHeart}
            onPress={() => router.push("/chat")}
          />
          <ActionTile
            title="Écouter"
            subtitle="Conseils en audio"
            icon={Headphones}
            onPress={() => router.push("/parcours")}
          />
        </View>
      </View>

      <Disclaimer />
    </Screen>
  );
}