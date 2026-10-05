import { useRouter } from "expo-router";
import {
  Gift,
  HandHeart,
  HeartHandshake,
  LifeBuoy,
  Share2,
  type LucideIcon,
} from "lucide-react-native";
import { Share, View } from "react-native";

import { ActionTile } from "@/components/ui/action-tile";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Header } from "@/components/ui/header";
import { HeroCard } from "@/components/ui/hero-card";
import { HubCard } from "@/components/ui/hub-card";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";
import { useAuth } from "@/context/auth-context";
import { ASSOCIATIONS } from "@/data/associations";
import { AssociationCard } from "@/features/associations/association-card";

type HelpKind = "financial" | "moral" | "volunteer" | "material";

export default function Association() {
  const router = useRouter();
  const { user } = useAuth();
  const isSupport = user?.profile === "support";

  const goHelp = (kind: HelpKind) =>
    router.push({ pathname: "/aide", params: { kind } });

  const shareApp = () =>
    Share.share({
      message:
        "Découvrez RoseLink, l'application gratuite de prévention et d'accompagnement face au cancer du sein.",
    }).catch(() => {});

  const tiles: { title: string; subtitle: string; icon: LucideIcon; onPress: () => void }[] =
    isSupport
      ? [
          {
            title: "Demander de l'aide",
            subtitle: "Prothèse, transport, soutien",
            icon: LifeBuoy,
            onPress: () => goHelp("financial"),
          },
          {
            title: "Faire un don",
            subtitle: "Orange Money, Mobicash",
            icon: HandHeart,
            onPress: () => router.push("/don"),
          },
        ]
      : [
          {
            title: "Faire un don",
            subtitle: "Orange Money, Mobicash",
            icon: HandHeart,
            onPress: () => router.push("/don"),
          },
          {
            title: "Devenir bénévole",
            subtitle: "Donner de votre temps",
            icon: HeartHandshake,
            onPress: () => goHelp("volunteer"),
          },
        ];

  return (
    <Screen>
      <Header
        title="Association"
        subtitle={isSupport ? "Aide et soutien près de vous." : "Agir ensemble, à votre façon."}
      />

      {isSupport ? (
        <HeroCard
          eyebrow="Vous n'êtes pas seule"
          title="Une aide existe"
          text="Des associations peuvent vous aider : prothèses, transport, médicaments et soutien moral."
          cta="Demander de l'aide"
          onPress={() => goHelp("financial")}
        />
      ) : (
        <HeroCard
          eyebrow="Solidarité"
          title="Soutenir les femmes touchées par le cancer du sein"
          text="Un don, du temps ou du matériel : chaque geste compte."
          cta="Faire un don"
          onPress={() => router.push("/don")}
        />
      )}

      <View className="flex-row gap-3">
        {tiles.map((tile) => (
          <ActionTile
            key={tile.title}
            title={tile.title}
            subtitle={tile.subtitle}
            icon={tile.icon}
            onPress={tile.onPress}
          />
        ))}
      </View>

      <SectionTitle>Associations partenaires</SectionTitle>
      <View className="gap-3">
        {ASSOCIATIONS.map((association) => (
          <AssociationCard key={association.id} association={association} />
        ))}
      </View>

      <SectionTitle>Agir autrement</SectionTitle>
      <View className="gap-3">
        {isSupport ? (
          <HubCard
            title="Soutien moral"
            subtitle="Visites, groupes de parole, écoute."
            icon={HeartHandshake}
            onPress={() => goHelp("moral")}
          />
        ) : (
          <HubCard
            title="Donner du matériel"
            subtitle="Perruques, foulards, prothèses."
            icon={Gift}
            onPress={() => goHelp("material")}
          />
        )}
        <HubCard
          title="Partager RoseLink"
          subtitle="Faire connaître l'application autour de vous."
          icon={Share2}
          onPress={shareApp}
        />
      </View>

      <Disclaimer />
    </Screen>
  );
}