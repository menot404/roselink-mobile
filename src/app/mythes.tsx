import { useRouter } from "expo-router";
import { Check, MessageCircleHeart, Quote, RotateCcw, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { ReviewNotice } from "@/components/ui/review-notice";
import { SourceLinks } from "@/components/ui/source-links";
import { useAppTheme } from "@/context/theme-context";
import { CLAIMS, MYTHES_REVIEW, type Claim, type Verdict } from "@/features/mythes/data";

function shuffled(items: Claim[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resultMessage(score: number, total: number) {
  const ratio = score / total;
  if (ratio >= 0.8) return "Bravo : vous connaissez bien les idées reçues sur le cancer du sein.";
  if (ratio >= 0.5) return "Bien joué ! Partagez ce que vous avez appris autour de vous.";
  return "Merci d'avoir joué. Ces idées sont très répandues : en parler, c'est déjà les faire reculer.";
}

export default function Mythes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [order, setOrder] = useState<Claim[]>(CLAIMS);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Verdict | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const claim = order[index];
  const answered = answer !== null;
  const correct = answered && answer === claim.verdict;

  const choose = (value: Verdict) => {
    if (answered) return;
    setAnswer(value);
    if (value === claim.verdict) setScore((current) => current + 1);
  };

  const next = () => {
    if (index === order.length - 1) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setAnswer(null);
    }
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const restart = () => {
    setOrder(shuffled(CLAIMS));
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setFinished(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {finished ? (
        <>
          <View className="items-center gap-4 rounded-3xl border border-line bg-surface p-8 dark:border-line-dark dark:bg-surface-dark">
            <Text className="font-jakarta-medium text-sm text-ink-soft dark:text-ink-soft-dark">
              Votre score
            </Text>
            <Text className="font-jakarta-bold text-5xl text-primary dark:text-primary-dark">
              {score} sur {order.length}
            </Text>
            <Text className="text-center font-jakarta text-base leading-6 text-ink dark:text-ink-dark">
              {resultMessage(score, order.length)}
            </Text>
          </View>
          <View className="gap-3">
            <Button label="Rejouer" icon={RotateCcw} onPress={restart} />
            <Button
              label="Poser une question"
              icon={MessageCircleHeart}
              variant="secondary"
              onPress={() => router.push("/chat")}
            />
            <Button label="Retour au parcours" variant="ghost" onPress={() => router.back()} />
          </View>
        </>
      ) : (
        <>
          <View className="gap-3">
            <View className="flex-row gap-1.5">
              {order.map((item, i) => (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i < index || (i === index && answered) ? colors.primary : colors.border,
                  }}
                />
              ))}
            </View>
            <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
              Question {index + 1} sur {order.length}
            </Text>
          </View>

          <View className="gap-4 rounded-3xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark">
            <Quote size={28} color={colors.primary} />
            <Text
              accessibilityRole="header"
              className="font-jakarta-bold text-xl leading-8 text-ink dark:text-ink-dark"
            >
              {claim.statement}
            </Text>
          </View>

          {!answered ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => choose("myth")}
                accessibilityRole="button"
                accessibilityLabel="Mythe"
                className="min-h-24 flex-1 items-center justify-center gap-2 rounded-3xl border-2 border-primary bg-surface active:opacity-80 dark:border-primary-dark dark:bg-surface-dark"
              >
                <X size={28} color={colors.primary} strokeWidth={2.6} />
                <Text className="font-jakarta-bold text-lg text-primary dark:text-primary-dark">
                  Mythe
                </Text>
              </Pressable>
              <Pressable
                onPress={() => choose("fact")}
                accessibilityRole="button"
                accessibilityLabel="Réalité"
                className="min-h-24 flex-1 items-center justify-center gap-2 rounded-3xl bg-primary active:opacity-80 dark:bg-primary-dark"
              >
                <Check size={28} color={colors.onPrimary} strokeWidth={2.6} />
                <Text className="font-jakarta-bold text-lg text-on-primary dark:text-on-primary-dark">
                  Réalité
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              <View
                accessibilityLiveRegion="polite"
                className={`gap-2 rounded-3xl border-2 p-5 ${
                  correct
                    ? "border-success bg-surface dark:border-success-dark dark:bg-surface-dark"
                    : "border-alert bg-surface dark:border-alert-dark dark:bg-surface-dark"
                }`}
              >
                <Text
                  className={`font-jakarta-bold text-base ${
                    correct ? "text-success dark:text-success-dark" : "text-alert dark:text-alert-dark"
                  }`}
                >
                  {correct ? "Bonne réponse" : "Pas tout à fait"}
                  {" : "}
                  {claim.verdict === "myth" ? "c'est un mythe" : "c'est une réalité"}
                </Text>
                <Text className="font-jakarta text-base leading-6 text-ink dark:text-ink-dark">
                  {claim.explanation}
                </Text>
                <SourceLinks ids={claim.sources} />
              </View>
              <Button
                label={index === order.length - 1 ? "Voir mon score" : "Question suivante"}
                onPress={next}
              />
            </View>
          )}

          <ReviewNotice {...MYTHES_REVIEW} />
          <Disclaimer />
        </>
      )}
    </ScrollView>
  );
}
