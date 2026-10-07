import { EyeOff, KeyRound } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Screen } from "@/components/ui/screen";
import { ToggleRow } from "@/components/ui/toggle-row";
import { useDiscreet, type VerifyResult } from "@/features/discret/discreet-context";
import { notificationText } from "@/features/discret/notification-texts";
import { isWeakPin } from "@/features/discret/pin";
import { PinPad } from "@/features/discret/pin-pad";
import { useQuickExit } from "@/features/discret/quick-exit-button";

type Mode = "idle" | "verify-change" | "verify-remove" | "new" | "confirm";

const TITLES: Record<Exclude<Mode, "idle">, string> = {
  "verify-change": "Entrez votre code actuel",
  "verify-remove": "Entrez votre code pour le désactiver",
  new: "Choisissez un code à 4 chiffres",
  confirm: "Confirmez votre code",
};

function describeFailure(result: VerifyResult): string {
  if (result.ok) return "";
  if (result.reason === "locked") return `Trop d'essais. Réessayez dans ${result.seconds} s.`;
  return `Code incorrect. ${result.attemptsLeft} essai${result.attemptsLeft > 1 ? "s" : ""} avant un blocage temporaire.`;
}

export default function Discret() {
  const { settings, hasPin, updateSettings, setPin: savePin, verifyPin, removePin } = useDiscreet();
  const quickExit = useQuickExit();

  const [mode, setMode] = useState<Mode>("idle");
  const [pin, setPin] = useState("");
  const [first, setFirst] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const start = (next: Mode) => {
    setMode(next);
    setPin("");
    setFirst("");
    setError("");
    setSuccess("");
  };

  const cancel = () => start("idle");

  const onComplete = async (value: string) => {
    setError("");

    if (mode === "verify-change" || mode === "verify-remove") {
      setBusy(true);
      const result = mode === "verify-change" ? await verifyPin(value) : await removePin(value);
      setBusy(false);
      setPin("");
      if (!result.ok) {
        setError(describeFailure(result));
        return;
      }
      if (mode === "verify-remove") {
        start("idle");
        setSuccess("Le code est désactivé.");
      } else {
        setMode("new");
      }
      return;
    }

    if (mode === "new") {
      if (isWeakPin(value)) {
        setPin("");
        setError("Ce code est trop facile à deviner. Choisissez-en un autre.");
        return;
      }
      setFirst(value);
      setPin("");
      setMode("confirm");
      return;
    }

    if (mode === "confirm") {
      if (value !== first) {
        setPin("");
        setFirst("");
        setMode("new");
        setError("Les deux codes ne correspondent pas. Recommencez.");
        return;
      }
      setBusy(true);
      await savePin(value);
      setBusy(false);
      start("idle");
      setSuccess("Votre code est activé. Il sera demandé à chaque ouverture.");
    }
  };

  const sample = notificationText("selfExam", settings.discreetNotifications);

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        Protégez votre vie privée : un code, un bouton pour quitter vite, et des notifications qui ne
        révèlent rien.
      </Text>

      <Card className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="font-jakarta-bold text-lg text-ink dark:text-ink-dark">Code PIN</Text>
          <Text
            className={`font-jakarta-semibold text-sm ${
              hasPin ? "text-success dark:text-success-dark" : "text-ink-soft dark:text-ink-soft-dark"
            }`}
          >
            {hasPin ? "Activé" : "Désactivé"}
          </Text>
        </View>

        {mode === "idle" ? (
          <View className="gap-3">
            <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
              Le code est demandé à l'ouverture, et quand vous revenez dans l'application après
              quelques instants.
            </Text>
            {hasPin ? (
              <>
                <Button
                  label="Changer le code"
                  icon={KeyRound}
                  variant="secondary"
                  onPress={() => start("verify-change")}
                />
                <Button
                  label="Désactiver le code"
                  variant="danger"
                  onPress={() => start("verify-remove")}
                />
              </>
            ) : (
              <Button label="Créer un code" icon={KeyRound} onPress={() => start("new")} />
            )}
            {success ? (
              <Text
                accessibilityLiveRegion="polite"
                className="font-jakarta-medium text-sm text-success dark:text-success-dark"
              >
                {success}
              </Text>
            ) : null}
          </View>
        ) : (
          <View className="items-center gap-6 py-2">
            <Text
              accessibilityRole="header"
              className="text-center font-jakarta-semibold text-base text-ink dark:text-ink-dark"
            >
              {TITLES[mode]}
            </Text>
            <PinPad value={pin} onChange={setPin} onComplete={onComplete} disabled={busy} />
            <Text
              accessibilityLiveRegion="polite"
              style={{ minHeight: 20 }}
              className="text-center font-jakarta-medium text-sm text-alert dark:text-alert-dark"
            >
              {error}
            </Text>
            <Button label="Annuler" variant="ghost" onPress={cancel} />
          </View>
        )}
      </Card>

      <Card className="gap-4">
        <ToggleRow
          label="Bouton « Quitter vite »"
          description="Un petit bouton en haut des écrans ouvre aussitôt un écran de notes banal. Pour revenir à RoseLink, maintenez le doigt 1,5 seconde sur le titre « Mes notes »."
          value={settings.quickExit}
          onValueChange={(value) => void updateSettings({ quickExit: value })}
        />
        {settings.quickExit ? (
          <Button label="Essayer maintenant" icon={EyeOff} variant="secondary" onPress={quickExit} />
        ) : null}
      </Card>

      <Card>
        <ToggleRow
          label="Masquer l'aperçu et les captures"
          description="Cache RoseLink dans la liste des applications récentes et bloque les captures d'écran, selon votre téléphone."
          value={settings.hidePreview}
          onValueChange={(value) => void updateSettings({ hidePreview: value })}
        />
      </Card>

      <Card className="gap-4">
        <ToggleRow
          label="Notifications discrètes"
          description="Les rappels n'affichent aucun mot lié à la santé."
          value={settings.discreetNotifications}
          onValueChange={(value) => void updateSettings({ discreetNotifications: value })}
        />
        <View className="gap-1 rounded-2xl bg-primary-soft p-4 dark:bg-primary-soft-dark">
          <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
            Exemple de rappel
          </Text>
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{sample.title}</Text>
          <Text className="font-jakarta text-sm text-ink dark:text-ink-dark">{sample.body}</Text>
        </View>
      </Card>

      <Text className="font-jakarta text-xs leading-5 text-ink-soft dark:text-ink-soft-dark">
        À savoir : le nom et l'icône de RoseLink restent visibles sur le téléphone. Un code à 4
        chiffres protège contre quelqu'un qui prend votre téléphone quelques minutes, pas contre une
        attaque informatique. Il n'existe aucun moyen de retrouver un code oublié.
      </Text>
      <Disclaimer />
    </Screen>
  );
}