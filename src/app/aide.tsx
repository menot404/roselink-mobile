import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Phone, Send } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Input } from "@/components/ui/input";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { useAppTheme } from "@/context/theme-context";
import { ASSOCIATIONS } from "@/data/associations";
import { makeReference, normalizePhone } from "@/features/associations/format";
import type { Option } from "@/types/account";

type Kind = "financial" | "moral" | "volunteer" | "material";
type Need = "prosthesis" | "transport" | "medicines" | "other";

const KINDS: Option<Kind>[] = [
  { value: "financial", label: "Aide financière" },
  { value: "moral", label: "Soutien moral" },
  { value: "volunteer", label: "Devenir bénévole" },
  { value: "material", label: "Donner du matériel" },
];

const NEEDS: Option<Need>[] = [
  { value: "prosthesis", label: "Prothèse ou soutien-gorge adapté" },
  { value: "transport", label: "Transport" },
  { value: "medicines", label: "Médicaments" },
  { value: "other", label: "Autre besoin" },
];

const ASSOCIATION_OPTIONS: Option<string>[] = [
  { value: "any", label: "Peu importe" },
  ...ASSOCIATIONS.map((association) => ({ value: association.id, label: association.name })),
];

const HINTS: Record<Kind, string> = {
  financial: "Prothèse, transport, médicaments : décrivez votre besoin, l'association vous répondra.",
  moral: "Visites de réconfort, groupes de parole, ligne d'écoute : vous n'êtes pas seule.",
  volunteer: "Donnez un peu de votre temps pour accompagner d'autres femmes.",
  material: "Perruques, foulards, prothèses : votre don peut servir à une autre femme.",
};

function isKind(value: unknown): value is Kind {
  return value === "financial" || value === "moral" || value === "volunteer" || value === "material";
}

export default function Aide() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ kind?: string; association?: string }>();

  const [kind, setKind] = useState<Kind | null>(isKind(params.kind) ? params.kind : null);
  const [need, setNeed] = useState<Need | null>(null);
  const [association, setAssociation] = useState(
    ASSOCIATIONS.some((a) => a.id === params.association) ? (params.association as string) : "any",
  );
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);

  const submit = () => {
    const next: Record<string, string> = {};
    if (!kind) next.kind = "Choisissez ce qui vous correspond.";
    if (kind === "financial" && !need) next.need = "Précisez votre besoin.";
    if (!normalizePhone(phone)) next.phone = "Entrez un numéro à 8 chiffres.";
    if (!consent) next.consent = "Merci de cocher cette case pour continuer.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setReference(makeReference("AIDE"));
  };

  if (reference) {
    return (
      <Screen padTop={false}>
        <Card className="items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
            <Check size={32} color={colors.primary} strokeWidth={3} />
          </View>
          <Text className="text-center font-jakarta-bold text-2xl text-ink dark:text-ink-dark">
            Demande enregistrée
          </Text>
          <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
            Référence : {reference}
          </Text>
        </Card>
        <Text className="text-center font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
          Dans cette version de démonstration, votre demande n'est envoyée à personne et rien n'est
          conservé. Dans la version réelle, elle sera transmise à l'association choisie, qui vous
          recontactera au numéro indiqué.
        </Text>
        <Button label="Retour aux associations" onPress={() => router.back()} />
        <Disclaimer />
      </Screen>
    );
  }

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        {kind ? HINTS[kind] : "Dites-nous comment l'association peut vous aider, ou comment vous souhaitez aider."}
      </Text>

      <Card className="gap-6">
        <OptionGroup
          label="Ce qui vous correspond"
          options={KINDS}
          value={kind}
          onChange={setKind}
          error={errors.kind}
        />
        {kind === "financial" ? (
          <OptionGroup
            label="Votre besoin"
            options={NEEDS}
            value={need}
            onChange={setNeed}
            error={errors.need}
          />
        ) : null}
        <OptionGroup
          label="Association"
          options={ASSOCIATION_OPTIONS}
          value={association}
          onChange={setAssociation}
        />
        <Input
          label="Un mot pour expliquer (facultatif)"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={300}
          placeholder="Quelques lignes suffisent"
        />
        <Input
          label="Numéro pour vous rappeler"
          icon={Phone}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="8 chiffres"
          error={errors.phone}
        />

        <Pressable
          onPress={() => setConsent((value) => !value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consent }}
          className="min-h-11 flex-row items-start gap-3"
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: consent ? colors.primary : colors.border,
              backgroundColor: consent ? colors.primary : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {consent ? <Check size={16} color={colors.onPrimary} strokeWidth={3} /> : null}
          </View>
          <Text className="flex-1 font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
            J'accepte d'être recontactée à ce numéro par l'association choisie.
          </Text>
        </Pressable>
        {errors.consent ? (
          <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">{errors.consent}</Text>
        ) : null}
      </Card>

      <Button label="Envoyer ma demande" icon={Send} onPress={submit} />
      <Disclaimer />
    </Screen>
  );
}