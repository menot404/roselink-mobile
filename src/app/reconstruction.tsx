import { useRouter } from "expo-router";
import { HeartHandshake, MessageCircleHeart } from "lucide-react-native";
import { Text, View } from "react-native";

import { AccordionCard } from "@/components/ui/accordion-card";
import { Bullet } from "@/components/ui/bullet";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { ReviewNotice } from "@/components/ui/review-notice";
import { Screen } from "@/components/ui/screen";
import { SourceLinks } from "@/components/ui/source-links";

/** Contenu à faire valider par un professionnel de santé (chirurgien, psychologue). */
const REVIEW = { validated: false } as const;

export default function Reconstruction() {
  const router = useRouter();

  return (
    <Screen padTop={false}>
      <View className="gap-2">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
        >
          Reconstruction et image de soi
        </Text>
        <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
          Après une opération du sein, vous avez le droit de prendre le temps, de poser toutes vos
          questions et de choisir ce qui vous convient.
        </Text>
      </View>

      <View className="gap-3">
        <AccordionCard title="Ce que vous ressentez" subtitle="C'est normal" defaultOpen>
          <Text className="font-jakarta text-base leading-6 text-ink dark:text-ink-dark">
            Après une opération du sein, beaucoup de femmes ressentent une perte, de la tristesse,
            parfois de la colère ou de la gêne face à leur corps. Ces émotions sont normales et
            peuvent prendre du temps. Être bien préparée et soutenue aide, mais il n'est jamais
            trop tard pour demander de l'aide.
          </Text>
        </AccordionCard>

        <AccordionCard title="Les options" subtitle="Aucune n'est obligatoire">
          <Bullet>
            Soutien-gorge adapté et prothèse externe : elle se glisse dans le soutien-gorge, sans
            nouvelle opération.
          </Bullet>
          <Bullet>Reconstruction avec un implant, par une opération.</Bullet>
          <Bullet>
            Reconstruction avec vos propres tissus, prélevés ailleurs sur votre corps, par une
            opération.
          </Bullet>
          <Bullet>
            Elle peut être faite en même temps que l'ablation du sein ou plus tard : à discuter
            avec le chirurgien, selon votre traitement.
          </Bullet>
          <Bullet>
            Choisir de ne pas reconstruire est aussi un choix, tout aussi légitime.
          </Bullet>
        </AccordionCard>

        <AccordionCard title="Questions à poser au chirurgien">
          <Bullet>Quelles options existent pour moi, et laquelle me conseillez-vous ?</Bullet>
          <Bullet>Quand pourrait-elle être faite, par rapport à mes autres traitements ?</Bullet>
          <Bullet>Quels sont les risques, et combien de temps dure la récupération ?</Bullet>
          <Bullet>Quel est le coût, et quelles aides existent ?</Bullet>
          <Bullet>Puis-je parler à une femme qui a fait ce choix ?</Bullet>
        </AccordionCard>

        <AccordionCard title="Des aides au Burkina Faso" subtitle="À confirmer auprès des structures">
          <Text className="font-jakarta text-base leading-6 text-ink dark:text-ink-dark">
            L'association Zéro Cancer Féminin a remis des prothèses mammaires à des femmes, et une
            contribution symbolique peut être demandée : renseignez-vous auprès d'elle pour les
            conditions actuelles. Des campagnes de chirurgie gratuite du cancer du sein sont aussi
            organisées par des partenaires comme la Fondation Orange Burkina.
          </Text>
        </AccordionCard>

        <AccordionCard title="Prendre soin de soi">
          <Bullet>Regardez-vous avec douceur, à votre rythme, sans vous presser.</Bullet>
          <Bullet>Parlez à une personne de confiance, à une psychologue ou à d'autres femmes.</Bullet>
          <Bullet>
            Choisissez des vêtements et des soutiens-gorge dans lesquels vous vous sentez bien.
          </Bullet>
        </AccordionCard>
      </View>

      <View className="gap-3">
        <Button
          label="Voir les associations"
          icon={HeartHandshake}
          onPress={() => router.push("/association")}
        />
        <Button
          label="En parler à l'assistante"
          icon={MessageCircleHeart}
          variant="secondary"
          onPress={() => router.push("/chat")}
        />
      </View>

      <SourceLinks ids={["inca-image", "inca-recon", "zcf"]} />
      <ReviewNotice {...REVIEW} />
      <Disclaimer />
    </Screen>
  );
}