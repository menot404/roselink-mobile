import { useRouter } from "expo-router";
import { LogOut, Trash2 } from "lucide-react-native";
import { Alert, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import {
  AGE_OPTIONS,
  FAMILY_OPTIONS,
  LANGUAGE_OPTIONS,
  PROFILE_OPTIONS,
  SCREENING_OPTIONS,
  STAGE_OPTIONS,
  labelOf,
} from "@/types/account";

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3 py-2">
      <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">{label}</Text>
      <Text className="flex-1 text-right font-jakarta-semibold text-sm text-ink dark:text-ink-dark">
        {value || "Non renseigné"}
      </Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      accessibilityRole="header"
      className="font-jakarta-bold text-lg text-ink dark:text-ink-dark"
    >
      {children}
    </Text>
  );
}

export default function Profil() {
  const router = useRouter();
  const { user, signOut, updateAccount, deleteAccount } = useAuth();
  const { preference, systemScheme } = useAppTheme();

  if (!user) return null;

  const initial = user.firstName.trim().charAt(0).toUpperCase();
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const confirmSignOut = () => {
    Alert.alert("Se déconnecter ?", "Tu pourras te reconnecter à tout moment.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Effacer mes données ?",
      "Ton compte et tes informations seront supprimés de ce téléphone. Cette action est définitive.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            router.replace("/");
          },
        },
      ],
    );
  };

  return (
    <Screen padTop={false}>
      <Card className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
          <Text className="font-jakarta-bold text-3xl text-primary dark:text-primary-dark">
            {initial}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="font-jakarta-bold text-xl text-ink dark:text-ink-dark">{fullName}</Text>
          <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
            {user.identifier}
          </Text>
        </View>
        <View className="rounded-full bg-primary-soft px-3 py-1 dark:bg-primary-soft-dark">
          <Text className="font-jakarta-semibold text-xs text-primary dark:text-primary-dark">
            {labelOf(PROFILE_OPTIONS, user.profile)}
          </Text>
        </View>
      </Card>

      <SectionLabel>Réglages</SectionLabel>
      <Card className="gap-3">
        <Text className="font-jakarta-semibold text-base text-ink dark:text-ink-dark">
          Apparence
        </Text>
        <ThemeSwitcher />
        <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
          {preference === "system"
            ? `Suit le thème de ton téléphone (actuellement : ${
                systemScheme === "dark" ? "sombre" : "clair"
              }).`
            : "Choix manuel. Passe sur « Auto » pour suivre ton téléphone."}
        </Text>
      </Card>
      <Card>
        <OptionGroup
          label="Langue préférée pour l'audio"
          options={LANGUAGE_OPTIONS}
          value={user.language}
          onChange={(value) => void updateAccount({ language: value })}
        />
      </Card>

      <SectionLabel>Mes informations</SectionLabel>
      <Card className="gap-1">
        <InfoRow label="Tranche d'âge" value={labelOf(AGE_OPTIONS, user.ageRange)} />
        <InfoRow label="Ville" value={user.city} />
        <InfoRow label="Langue" value={labelOf(LANGUAGE_OPTIONS, user.language)} />
        {user.profile === "support" ? (
          <InfoRow label="Stade" value={labelOf(STAGE_OPTIONS, user.stage)} />
        ) : (
          <InfoRow label="Dépistage" value={labelOf(SCREENING_OPTIONS, user.screening)} />
        )}
        <InfoRow label="Antécédents familiaux" value={labelOf(FAMILY_OPTIONS, user.familyHistory)} />
      </Card>

      <SectionLabel>Confidentialité</SectionLabel>
      <Card className="gap-3">
        <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
          Tes informations restent sur ce téléphone. Rien n'est envoyé ailleurs dans cette version
          de démonstration.
        </Text>
        <Button label="Effacer mes données" icon={Trash2} variant="danger" onPress={confirmDelete} />
      </Card>

      <Disclaimer />
      <Button label="Se déconnecter" icon={LogOut} variant="secondary" onPress={confirmSignOut} />
    </Screen>
  );
}