import Constants from "expo-constants";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";

type Tone = "real" | "demo";

const STATUS: { feature: string; badge: string; tone: Tone; text: string }[] = [
  {
    feature: "Conseils de santé",
    badge: "À valider",
    tone: "demo",
    text: "Écrits à partir de l'OMS et d'autres sources sérieuses. Relecture par un professionnel de santé en cours.",
  },
  {
    feature: "Chat",
    badge: "Base de réponses",
    tone: "demo",
    text: "Ce n'est pas une intelligence artificielle libre : une base de réponses préparées, avec leurs sources.",
  },
  {
    feature: "Audio",
    badge: "Démo",
    tone: "demo",
    text: "Sons de démonstration. Les enregistrements d'experts, en plusieurs langues, sont en préparation.",
  },
  {
    feature: "Carte",
    badge: "Réel",
    tone: "real",
    text: "Carte réelle et calcul des distances. Les fiches des centres sont à vérifier avant de vous déplacer.",
  },
  {
    feature: "Histoires de femmes",
    badge: "Fiction",
    tone: "demo",
    text: "Histoires écrites pour la démonstration. De vrais témoignages demanderont l'accord écrit de chaque femme.",
  },
  {
    feature: "Dons et demandes d'aide",
    badge: "Simulé",
    tone: "demo",
    text: "Aucun paiement et aucun envoi : la version réelle passera par Orange Money et Mobicash.",
  },
  {
    feature: "Rappels",
    badge: "Réel",
    tone: "real",
    text: "Notifications programmées sur votre téléphone, sans serveur.",
  },
  {
    feature: "Vos données",
    badge: "Réel",
    tone: "real",
    text: "Elles restent sur votre téléphone. Vous pouvez tout effacer depuis votre profil.",
  },
];

const CREDITS = [
  "Informations sur le cancer du sein : Organisation mondiale de la Santé, OMS Afrique, ministère de la Santé du Burkina Faso, guides d'hôpitaux et de centres de lutte contre le cancer (liens dans chaque réponse).",
  "Carte : © OpenStreetMap contributors, © CARTO, Leaflet.",
  "Icônes : Lucide. Police : Plus Jakarta Sans (licence SIL OFL).",
  "Application créée avec Expo et React Native.",
  "Projet réalisé pour le Hackathon Octobre Rose 2026, Orange Digital Center, Ouagadougou.",
];

export default function Apropos() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <Screen padTop={false}>
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
        >
          RoseLink
        </Text>
        <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
          Application gratuite de prévention et d'accompagnement face au cancer du sein. Version{" "}
          {version} (prototype).
        </Text>
      </View>

      <SectionTitle>Ce qui est réel, ce qui est simulé</SectionTitle>
      <View className="gap-3">
        {STATUS.map((item) => (
          <Card key={item.feature} className="gap-2">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 font-jakarta-bold text-base text-ink dark:text-ink-dark">
                {item.feature}
              </Text>
              <View
                className={`rounded-full border px-2.5 py-0.5 ${
                  item.tone === "real"
                    ? "border-success dark:border-success-dark"
                    : "border-alert dark:border-alert-dark"
                }`}
              >
                <Text
                  className={`font-jakarta-bold text-[11px] ${
                    item.tone === "real"
                      ? "text-success dark:text-success-dark"
                      : "text-alert dark:text-alert-dark"
                  }`}
                >
                  {item.badge}
                </Text>
              </View>
            </View>
            <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
              {item.text}
            </Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Crédits</SectionTitle>
      <Card className="gap-3">
        {CREDITS.map((line) => (
          <Text
            key={line}
            className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark"
          >
            {line}
          </Text>
        ))}
      </Card>

      <Disclaimer />
    </Screen>
  );
}