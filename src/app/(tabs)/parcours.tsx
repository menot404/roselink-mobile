import { useRouter } from "expo-router";
import {
  Hand,
  Headphones,
  Lightbulb,
  PenLine,
  Quote,
  Sparkles,
  Stethoscope,
  Wind,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";

import { Disclaimer } from "@/components/ui/disclaimer";
import { Header } from "@/components/ui/header";
import { HubCard } from "@/components/ui/hub-card";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/context/auth-context";

type Entry = { title: string; subtitle: string; icon: LucideIcon; href?: "/signes" };

const PREVENTION: Entry[] = [
  {
    title: "Signes d'alerte",
    subtitle: "Reconnaître les changements du sein.",
    icon: Stethoscope,
    href: "/signes",
  },
  { title: "Connaître ses seins", subtitle: "Le geste mensuel, pas à pas.", icon: Hand },
  { title: "Mythes ou réalités", subtitle: "Démêler le vrai du faux.", icon: Lightbulb },
  {
    title: "Conseils en audio",
    subtitle: "Écouter des experts, dans votre langue.",
    icon: Headphones,
  },
];

const SUPPORT: Entry[] = [
  { title: "Journal d'humeur", subtitle: "Suivre vos émotions au quotidien.", icon: PenLine },
  { title: "Respiration et détente", subtitle: "Des exercices guidés de 5 minutes.", icon: Wind },
  {
    title: "Histoires de femmes",
    subtitle: "Des témoignages pour se sentir moins seule.",
    icon: Quote,
  },
  {
    title: "Reconstruction et image de soi",
    subtitle: "Informations et conseils.",
    icon: Sparkles,
  },
];

export default function Parcours() {
  const router = useRouter();
  const { user } = useAuth();
  const isSupport = user?.profile === "support";
  const entries = isSupport ? SUPPORT : PREVENTION;

  return (
    <Screen>
      <Header
        title="Mon parcours"
        subtitle={
          isSupport
            ? "Accompagnement : prendre soin de vous."
            : "Prévention : apprendre, se repérer, agir."
        }
      />
      <View className="gap-3">
        {entries.map((entry) => (
          <HubCard
            key={entry.title}
            title={entry.title}
            subtitle={entry.subtitle}
            icon={entry.icon}
            onPress={entry.href ? () => router.push(entry.href as "/signes") : undefined}
          />
        ))}
      </View>
      <Disclaimer />
    </Screen>
  );
}