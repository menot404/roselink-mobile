import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  MapPin,
  MessageCircleHeart,
  Stethoscope,
  UserPlus,
  type LucideIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";

type Slide = { id: string; Icon: LucideIcon; title: string; text: string };

const SLIDES: Slide[] = [
  {
    id: "signes",
    Icon: Stethoscope,
    title: "Connais les signes",
    text: "Apprends à repérer les changements de ton corps, avec des explications simples et en images.",
  },
  {
    id: "centres",
    Icon: MapPin,
    title: "Trouve où te faire dépister",
    text: "Découvre les centres près de toi, leurs services et les cliniques mobiles.",
  },
  {
    id: "soutien",
    Icon: MessageCircleHeart,
    title: "Tu n'es pas seule",
    text: "Pose tes questions sans jugement et écoute des conseils d'experts en audio, dans ta langue.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { scheme, colors } = useAppTheme();
  const { completeOnboarding } = useAuth();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const gradient =
    scheme === "dark"
      ? (["#FF8DB3", "#F06A98"] as const)
      : (["#E8467C", "#B02558"] as const);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const scrollTo = (target: number) =>
    listRef.current?.scrollToIndex({ index: target, animated: true });

  const go = async (path: "/inscription" | "/connexion") => {
    await completeOnboarding();
    router.replace(path);
  };

  return (
    <View
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <View className="h-14 flex-row items-center justify-end px-5">
        {!isLast ? (
          <Pressable
            onPress={() => scrollTo(SLIDES.length - 1)}
            accessibilityRole="button"
            accessibilityLabel="Passer"
            className="min-h-11 justify-center px-2"
          >
            <Text className="font-jakarta-semibold text-sm text-ink-soft dark:text-ink-soft-dark">
              Passer
            </Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center gap-10 px-8"
          >
            <View
              style={{ width: 240, height: 240, alignItems: "center", justifyContent: "center" }}
            >
              <View
                style={{
                  position: "absolute",
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  backgroundColor: colors.primarySoft,
                  opacity: 0.7,
                }}
              />
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 168,
                  height: 168,
                  borderRadius: 84,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <item.Icon size={76} color="#FFFFFF" strokeWidth={1.8} />
              </LinearGradient>
            </View>
            <View className="items-center gap-3">
              <Text
                accessibilityRole="header"
                className="text-center font-jakarta-bold text-[28px] leading-9 text-ink dark:text-ink-dark"
              >
                {item.title}
              </Text>
              <Text className="text-center font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="flex-row items-center justify-center gap-2 py-5">
        {SLIDES.map((slide, i) => (
          <View
            key={slide.id}
            style={{
              height: 8,
              width: i === index ? 28 : 8,
              borderRadius: 4,
              backgroundColor: i === index ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      <View className="gap-3 px-5" style={{ minHeight: 108, justifyContent: "flex-end" }}>
        {isLast ? (
          <>
            <Button label="Créer mon compte" icon={UserPlus} onPress={() => go("/inscription")} />
            <Button label="J'ai déjà un compte" variant="secondary" onPress={() => go("/connexion")} />
          </>
        ) : (
          <Button label="Suivant" icon={ArrowRight} onPress={() => scrollTo(index + 1)} />
        )}
      </View>
    </View>
  );
}