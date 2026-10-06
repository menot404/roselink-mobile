import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Headphones, PenLine, Play, Square } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { useAppTheme } from "@/context/theme-context";
import { useBreathing, type BreathPhase } from "@/features/respiration/use-breathing";
import type { Option } from "@/types/account";

type SessionLength = "60" | "180" | "300";

const LENGTHS: Option<SessionLength>[] = [
  { value: "60", label: "1 minute" },
  { value: "180", label: "3 minutes" },
  { value: "300", label: "5 minutes" },
];

const PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: "Inspirez",
  hold: "Gardez",
  exhale: "Expirez",
};

const SIZE = 240;
const MIN_SCALE = 0.62;

export default function Respiration() {
  const router = useRouter();
  const { scheme, colors } = useAppTheme();
  const [length, setLength] = useState<SessionLength>("180");
  const total = Number(length);
  const { status, phase, remaining, cycles, progress, start, stop } = useBreathing(total);

  const scale = useRef(new Animated.Value(MIN_SCALE)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      scale.setValue(phase === "inhale" || phase === "hold" ? 1 : MIN_SCALE);
      return;
    }
    if (phase === "inhale") {
      Animated.timing(scale, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if (phase === "exhale") {
      Animated.timing(scale, {
        toValue: MIN_SCALE,
        duration: 6000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if (phase === null) {
      Animated.timing(scale, { toValue: MIN_SCALE, duration: 400, useNativeDriver: true }).start();
    }
  }, [phase, reduceMotion, scale]);

  const gradient =
    scheme === "dark" ? (["#FF8DB3", "#F06A98"] as const) : (["#E8467C", "#B02558"] as const);

  const label =
    status === "running" ? PHASE_LABEL[phase ?? "inhale"] : status === "done" ? "Bravo" : "Prête ?";

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        Suivez le cercle : il grandit quand vous inspirez et se réduit quand vous expirez. Prenez
        quelques minutes pour vous.
      </Text>

      <View style={{ height: SIZE + 24, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            position: "absolute",
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: 2,
            borderColor: colors.border,
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            overflow: "hidden",
            transform: [{ scale }],
          }}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <View style={{ alignItems: "center", gap: 4 }}>
          <Text
            accessibilityLiveRegion="polite"
            className="font-jakarta-bold text-2xl text-white"
          >
            {label}
          </Text>
          {status === "running" ? (
            <Text className="font-jakarta-bold text-5xl text-white">{remaining}</Text>
          ) : null}
        </View>
      </View>

      {status === "running" ? (
        <View className="gap-2">
          <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.primarySoft }}>
            <View
              style={{
                height: 6,
                borderRadius: 3,
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
          <Text className="text-center font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
            Respiration {cycles + 1}
          </Text>
        </View>
      ) : null}

      {status === "done" ? (
        <Card className="items-center gap-2">
          <Text className="text-center font-jakarta-bold text-lg text-ink dark:text-ink-dark">
            Bravo, vous avez pris {Math.round(total / 60)} minute{total >= 120 ? "s" : ""} pour vous
          </Text>
          <Text className="text-center font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
            Comment vous sentez-vous maintenant ? Vous pouvez le noter dans votre journal.
          </Text>
        </Card>
      ) : null}

      {status !== "running" ? (
        <Card>
          <OptionGroup label="Durée" options={LENGTHS} value={length} onChange={setLength} />
        </Card>
      ) : null}

      <View className="gap-3">
        {status === "running" ? (
          <Button label="Arrêter" icon={Square} variant="secondary" onPress={stop} />
        ) : (
          <Button label={status === "done" ? "Recommencer" : "Commencer"} icon={Play} onPress={start} />
        )}
        {status === "done" ? (
          <Button
            label="Noter mon humeur"
            icon={PenLine}
            variant="secondary"
            onPress={() => router.push("/humeur")}
          />
        ) : null}
        <Button
          label="Écouter la version guidée"
          icon={Headphones}
          variant="ghost"
          onPress={() => router.push({ pathname: "/audio", params: { id: "respiration-fr" } })}
        />
      </View>

      <Text className="text-center font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
        Si vous avez des vertiges, reprenez une respiration normale. Cet exercice ne remplace pas un
        suivi médical.
      </Text>
      <Disclaimer />
    </Screen>
  );
}