import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = { eyebrow: string; title: string; text: string; cta: string; onPress: () => void };

export function HeroCard({ eyebrow, title, text, cta, onPress }: Props) {
  const { scheme } = useAppTheme();
  const gradient =
    scheme === "dark"
      ? (["#7A2447", "#3A1A2B"] as const)
      : (["#D6336C", "#9E2150"] as const);

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 28, padding: 24, gap: 16 }}
    >
      <View className="self-start rounded-full bg-white/20 px-3 py-1">
        <Text className="font-jakarta-semibold text-xs text-white">{eyebrow}</Text>
      </View>
      <View className="gap-2">
        <Text className="font-jakarta-bold text-[26px] leading-8 text-white">{title}</Text>
        <Text className="font-jakarta text-sm leading-5 text-white">{text}</Text>
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={cta}
        className="min-h-12 flex-row items-center justify-center gap-2 self-start rounded-full bg-white px-5 active:opacity-90"
      >
        <Text className="font-jakarta-bold text-sm text-brand-700">{cta}</Text>
        <ArrowRight size={18} color="#B02558" />
      </Pressable>
    </LinearGradient>
  );
}