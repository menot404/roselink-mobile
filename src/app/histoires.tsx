import { useRouter } from "expo-router";
import { Headphones, Info } from "lucide-react-native";
import { Text, View } from "react-native";

import { AccordionCard } from "@/components/ui/accordion-card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Screen } from "@/components/ui/screen";
import { useAppTheme } from "@/context/theme-context";
import { STORIES } from "@/data/temoignages";

export default function Histoires() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        Des histoires pour vous rappeler que d'autres femmes ont traversé cette épreuve, et qu'on
        peut s'y sentir moins seule.
      </Text>

      <View className="flex-row items-start gap-2 rounded-2xl border border-alert p-4 dark:border-alert-dark">
        <Info size={18} color={colors.alert} style={{ marginTop: 1 }} />
        <Text className="flex-1 font-jakarta-semibold text-sm leading-5 text-ink dark:text-ink-dark">
          Ces histoires sont fictives : elles sont écrites pour la démonstration. Dans la version
          réelle, chaque témoignage sera partagé avec l'accord écrit de la femme concernée.
        </Text>
      </View>

      <View className="gap-3">
        {STORIES.map((story, index) => (
          <AccordionCard
            key={story.id}
            title={`${story.firstName} (exemple)`}
            subtitle={`${story.theme} · ${story.readingMinutes} min de lecture`}
            defaultOpen={index === 0}
          >
            {story.paragraphs.map((paragraph) => (
              <Text
                key={paragraph}
                className="font-jakarta text-base leading-7 text-ink dark:text-ink-dark"
              >
                {paragraph}
              </Text>
            ))}
          </AccordionCard>
        ))}
      </View>

      <Button
        label="Écouter un message de soutien"
        icon={Headphones}
        variant="secondary"
        onPress={() => router.push({ pathname: "/audio", params: { id: "soutien-fr" } })}
      />
      <Disclaimer />
    </Screen>
  );
}