import { useRouter } from "expo-router";
import { Lock, LogIn, UserRound } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/context/auth-context";

export default function Connexion() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});

  const submit = async () => {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Entre ton téléphone ou ton e-mail.";
    if (password.length < 6) next.password = "Au moins 6 caractères.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = await signIn(identifier);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    router.replace("/accueil");
  };

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base text-ink-soft dark:text-ink-soft-dark">
        Content de te revoir. Tu peux aussi utiliser RoseLink sans compte.
      </Text>
      <Card className="gap-4">
        <Input
          label="Téléphone ou e-mail"
          icon={UserRound}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          error={errors.identifier}
        />
        <Input
          label="Mot de passe"
          icon={Lock}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />
        {errors.form ? (
          <Text className="font-jakarta-medium text-sm text-alert dark:text-alert-dark">
            {errors.form}
          </Text>
        ) : null}
        <Button label="Se connecter" icon={LogIn} onPress={submit} />
      </Card>
      <Pressable onPress={() => router.replace("/inscription")} accessibilityRole="link" className="min-h-11 items-center justify-center">
        <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
            Pas encore de compte ? Inscris-toi
        </Text>
      </Pressable>
      <Text className="text-center font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
        Version de démonstration : le compte reste sur ce téléphone et le mot de passe n'est ni vérifié ni enregistré.
      </Text>
    </Screen>
  );
}