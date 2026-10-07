import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";

import { useDiscreet } from "./discreet-context";
import { PinPad } from "./pin-pad";

/** Écran de verrouillage : il n'affiche que le nom de l'application et un clavier. */
export function LockScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { unlock, eraseAll } = useDiscreet();
  const { deleteAccount } = useAuth();

  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const counting = seconds > 0;

  // le bouton retour du téléphone ne doit pas ouvrir l'écran caché derrière
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => clearInterval(id);
  }, [counting]);

  const handleComplete = async (value: string) => {
    setBusy(true);
    const result = await unlock(value);
    if (result.ok) return; // l'écran disparaît
    setBusy(false);
    setPin("");
    if (result.reason === "locked") {
      setMessage("");
      setSeconds(result.seconds);
    } else {
      setMessage(
        `Code incorrect. ${result.attemptsLeft} essai${
          result.attemptsLeft > 1 ? "s" : ""
        } avant un blocage temporaire.`,
      );
    }
  };

  const forgot = () =>
    Alert.alert(
      "Code oublié ?",
      "Pour protéger votre vie privée, il n'existe aucun moyen de retrouver votre code. Vous pouvez effacer toutes vos données sur ce téléphone (compte, journal, réglages) et recommencer.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            await eraseAll();
            router.replace("/");
          },
        },
      ],
    );

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        elevation: 100,
        backgroundColor: colors.canvas,
        paddingTop: insets.top + 48,
        paddingBottom: insets.bottom + 24,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View className="items-center gap-3">
        <LinearGradient
          colors={["#E8467C", "#B02558"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={30} color="#FFFFFF" fill="#FFFFFF" />
        </LinearGradient>
        <Text className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark">RoseLink</Text>
        <Text className="font-jakarta text-base text-ink-soft dark:text-ink-soft-dark">
          Entrez votre code
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          style={{ minHeight: 40 }}
          className="px-8 text-center font-jakarta-medium text-sm text-alert dark:text-alert-dark"
        >
          {counting ? `Trop d'essais. Réessayez dans ${seconds} s.` : message}
        </Text>
      </View>

      <PinPad value={pin} onChange={setPin} onComplete={handleComplete} disabled={busy || counting} />

      <Pressable
        onPress={forgot}
        accessibilityRole="button"
        className="min-h-11 items-center justify-center px-4"
      >
        <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
          Code oublié ?
        </Text>
      </Pressable>
    </View>
  );
}