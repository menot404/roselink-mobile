import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  HeartHandshake,
  MapPin,
  MessageCircleHeart,
  Search,
  Stethoscope,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconBadge } from "@/components/ui/icon-badge";
import { ReviewNotice } from "@/components/ui/review-notice";
import { SourceLinks } from "@/components/ui/source-links";
import { useAppTheme } from "@/context/theme-context";
import { PalpationDiagram, PoseDiagram } from "@/features/connaitre/diagrams";
import { CONNAITRE_REVIEW, STEPS, type StepVisual } from "@/features/connaitre/steps";
import { formatFrenchDate, useSelfExamLog } from "@/features/connaitre/use-self-exam-log";

function Visual({ visual }: { visual: StepVisual }) {
  switch (visual) {
    case "pose-down":
      return <PoseDiagram pose="down" />;
    case "pose-up":
      return <PoseDiagram pose="up" />;
    case "pose-hips":
      return <PoseDiagram pose="hips" />;
    case "palpation-standing":
    case "palpation-lying":
      return <PalpationDiagram />;
    case "nipple-armpit":
      return <IconBadge icon={Search} size={96} />;
    case "act":
      return <IconBadge icon={HeartHandshake} size={96} />;
    default:
      return <IconBadge icon={CalendarDays} size={96} />;
  }
}

const PALPATION_CAPTION: Partial<Record<StepVisual, string>> = {
  "palpation-standing": "Du mamelon vers l'extérieur, en petits cercles, jusqu'à l'aisselle.",
  "palpation-lying": "Même geste, allongée, un coussin sous l'épaule.",
};

export default function Connaitre() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { lastDone, markDone } = useSelfExamLog();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;
  const caption = PALPATION_CAPTION[step.visual];

  const goTo = (next: number) => {
    setIndex(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <View className="flex-row gap-1.5">
          {STEPS.map((item, i) => (
            <View
              key={item.id}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: i <= index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
          Étape {index + 1} sur {STEPS.length}
        </Text>
      </View>

      <View
        accessible
        accessibilityLabel={`Illustration : ${step.title}`}
        style={{ minHeight: 240, backgroundColor: colors.primarySoft }}
        className="items-center justify-center gap-3 rounded-3xl p-5"
      >
        <Visual visual={step.visual} />
        {caption ? (
          <Text className="text-center font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
            {caption}
          </Text>
        ) : null}
      </View>

      <View className="gap-3">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-2xl leading-8 text-ink dark:text-ink-dark"
        >
          {step.title}
        </Text>
        <Text className="font-jakarta text-base leading-7 text-ink dark:text-ink-dark">
          {step.instruction}
        </Text>
      </View>

      {step.tips.length > 0 ? (
        <View className="gap-2 rounded-2xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark">
          <Text className="font-jakarta-bold text-sm text-primary dark:text-primary-dark">
            À savoir
          </Text>
          {step.tips.map((tip) => (
            <View key={tip} className="flex-row items-start gap-3">
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  marginTop: 8,
                  backgroundColor: colors.primary,
                }}
              />
              <Text className="flex-1 font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
                {tip}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {isLast ? (
        <View className="gap-3">
          <Button
            label="J'ai fait mon geste ce mois-ci"
            icon={Check}
            onPress={() => void markDone()}
          />
          {lastDone ? (
            <Text className="text-center font-jakarta-medium text-sm text-success dark:text-success-dark">
              Dernier geste enregistré le {formatFrenchDate(lastDone)}.
            </Text>
          ) : null}
          <Button
            label="Programmer un rappel mensuel"
            icon={Bell}
            variant="secondary"
            onPress={() => router.push("/rappels")}
          />
          <Button
            label="Trouver un centre"
            icon={MapPin}
            variant="secondary"
            onPress={() => router.push("/carte")}
          />
          <Button
            label="Voir les signes"
            icon={Stethoscope}
            variant="secondary"
            onPress={() => router.push("/signes")}
          />
          <Button
            label="Poser une question"
            icon={MessageCircleHeart}
            variant="secondary"
            onPress={() => router.push("/chat")}
          />
          <SourceLinks ids={["who-bc", "afro-bf"]} />
        </View>
      ) : null}

      <View className="flex-row gap-3">
        {!isFirst ? (
          <View className="flex-1">
            <Button
              label="Précédent"
              icon={ArrowLeft}
              variant="secondary"
              onPress={() => goTo(index - 1)}
            />
          </View>
        ) : null}
        {!isLast ? (
          <View className="flex-1">
            <Button label="Suivant" icon={ArrowRight} onPress={() => goTo(index + 1)} />
          </View>
        ) : null}
      </View>

      <ReviewNotice {...CONNAITRE_REVIEW} />
      <Disclaimer />
    </ScrollView>
  );
}