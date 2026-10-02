import { useRouter } from "expo-router";
import { LogIn, LogOut, UserPlus, UserRound } from "lucide-react-native";
import { Alert, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconBadge } from "@/components/ui/icon-badge";
import { Screen } from "@/components/ui/screen";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useAuth } from "@/context/auth-context";

export default function Compte() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert("Se déconnecter ?", "Tu pourras te reconnecter à tout moment.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/accueil");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <Screen padTop={false}>
        <Card className="gap-4">
          <View className="items-center">
            <IconBadge icon={UserRound} size={64} />
          </View>
          <Text className="text-center font-jakarta-bold text-lg text-ink dark:text-ink-dark">
            Tu n'es pas connectée
          </Text>
          <Text className="text-center font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
            Tu peux utiliser RoseLink sans compte. Un compte garde tes réglages sur ce téléphone.
          </Text>
          <Button label="Connexion" icon={LogIn} onPress={() => router.push("/connexion")} />
          <Button label="Inscription" icon={UserPlus} variant="secondary" onPress={() => router.push("/inscription")} />
        </Card>
        <Card className="gap-3">
          <Text className="font-jakarta-semibold text-lg text-ink dark:text-ink-dark">
            Apparence
          </Text>
          <ThemeSwitcher />
        </Card>
        <Disclaimer />
      </Screen>
    );
  }

  return (
    <Screen padTop={false}>
      <Card className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
          <Text className="font-jakarta-bold text-3xl text-primary dark:text-primary-dark">
            {user.firstName.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="items-center gap-0.5">
          <Text className="font-jakarta-bold text-xl text-ink dark:text-ink-dark">
            {user.firstName}
          </Text>
          <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
            {user.identifier}
          </Text>
        </View>
      </Card>
      <Card className="gap-3">
        <Text className="font-jakarta-semibold text-lg text-ink dark:text-ink-dark">Apparence</Text>
        <ThemeSwitcher />
      </Card>
      <Button label="Se déconnecter" icon={LogOut} variant="secondary" onPress={confirmSignOut} />
      <Disclaimer />
    </Screen>
  );
}