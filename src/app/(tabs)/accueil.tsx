import { useRouter } from "expo-router";
import {
  Headphones,
  MapPin,
  MessageCircleHeart,
  Stethoscope,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { ActionTile } from "@/components/ui/action-tile";
import { Disclaimer } from "@/components/ui/disclaimer";
import { HeroCard } from "@/components/ui/hero-card";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";

export default function Accueil() {
  const router = useRouter();

  return (
    <Screen>
      <View className="gap-0.5">
        <Text className="font-jakarta-medium text-sm text-ink-soft dark:text-ink-soft-dark">
        </Text>
        <Text className="font-jakarta-bold text-[26px] leading-8 text-ink dark:text-ink-dark">
          Prends soin de toi
        </Text>
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
            onPress={() => router.push("/audio")}
          />
        </View>
      </View>

      <Disclaimer />
    </Screen>
  );
}
