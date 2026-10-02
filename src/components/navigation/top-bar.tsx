import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";

export function TopBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const initial = user?.firstName.trim().charAt(0).toUpperCase() || "R";

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.canvas,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View className="h-16 flex-row items-center justify-between px-4">
        <Pressable
          onPress={() => router.navigate("/accueil")}
          accessibilityRole="button"
          accessibilityLabel="RoseLink, retour à l'accueil"
          className="flex-row items-center gap-2"
        >
          <LinearGradient
            colors={["#E8467C", "#B02558"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
          </LinearGradient>
          <Text className="font-jakarta-bold text-lg text-ink dark:text-ink-dark">
            Rose<Text className="text-primary dark:text-primary-dark">Link</Text>
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/profil")}
          accessibilityRole="button"
          accessibilityLabel="Mon profil et réglages"
          className="h-11 w-11 items-center justify-center rounded-full border border-primary bg-primary-soft active:opacity-80 dark:border-primary-dark dark:bg-primary-soft-dark"
        >
          <Text className="font-jakarta-bold text-base text-primary dark:text-primary-dark">
            {initial}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}