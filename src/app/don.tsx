import { useRouter } from "expo-router";
import { Check, Info, Phone, Share2 } from "lucide-react-native";
import { useState } from "react";
import { Share, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Input } from "@/components/ui/input";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { useAppTheme } from "@/context/theme-context";
import { ASSOCIATIONS } from "@/data/associations";
import {
  formatDateTimeFr,
  formatFcfa,
  makeReference,
  maskPhone,
  normalizePhone,
} from "@/features/associations/format";
import type { Option } from "@/types/account";

type AmountChoice = "5000" | "10000" | "25000" | "custom";
type Method = "orange" | "mobicash";

const MIN_AMOUNT = 500;
const MAX_AMOUNT = 1_000_000;

const AMOUNTS: Option<AmountChoice>[] = [
  { value: "5000", label: formatFcfa(5000) },
  { value: "10000", label: formatFcfa(10000) },
  { value: "25000", label: formatFcfa(25000) },
  { value: "custom", label: "Autre montant" },
];

const METHODS: Option<Method>[] = [
  { value: "orange", label: "Orange Money" },
  { value: "mobicash", label: "Mobicash" },
];

const DESTINATIONS: Option<string>[] = [
  { value: "general", label: "Là où c'est le plus utile" },
  ...ASSOCIATIONS.map((association) => ({ value: association.id, label: association.name })),
];

type Receipt = {
  reference: string;
  date: string;
  amount: number;
  method: string;
  destination: string;
  phone: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-3 py-2">
      <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">{label}</Text>
      <Text className="flex-1 text-right font-jakarta-semibold text-sm text-ink dark:text-ink-dark">
        {value}
      </Text>
    </View>
  );
}

export default function Don() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [choice, setChoice] = useState<AmountChoice | null>(null);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method | null>(null);
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("general");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const amount =
    choice === "custom" ? Number(custom.replace(/\s/g, "")) : choice ? Number(choice) : 0;

  const submit = () => {
    const next: Record<string, string> = {};
    if (!choice) next.amount = "Choisissez un montant.";
    else if (!Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      next.amount = `Entrez un montant entre ${formatFcfa(MIN_AMOUNT)} et ${formatFcfa(MAX_AMOUNT)}.`;
    }
    if (!method) next.method = "Choisissez un moyen de paiement.";
    const digits = normalizePhone(phone);
    if (!digits) next.phone = "Entrez un numéro à 8 chiffres.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !method || !digits) return;

    setReceipt({
      reference: makeReference("RL"),
      date: formatDateTimeFr(new Date()),
      amount,
      method: method === "orange" ? "Orange Money" : "Mobicash",
      destination:
        DESTINATIONS.find((option) => option.value === destination)?.label ?? "Là où c'est le plus utile",
      phone: maskPhone(digits),
    });
  };

  const reset = () => {
    setReceipt(null);
    setChoice(null);
    setCustom("");
    setMethod(null);
    setPhone("");
    setDestination("general");
    setErrors({});
  };

  if (receipt) {
    return (
      <Screen padTop={false}>
        <Card className="items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
            <Check size={32} color={colors.primary} strokeWidth={3} />
          </View>
          <Text className="text-center font-jakarta-bold text-2xl text-ink dark:text-ink-dark">
            Merci pour votre geste
          </Text>
          <View className="rounded-full border border-alert px-3 py-1 dark:border-alert-dark">
            <Text className="font-jakarta-bold text-xs text-alert dark:text-alert-dark">
              REÇU FICTIF : DÉMONSTRATION
            </Text>
          </View>
        </Card>

        <Card className="gap-1">
          <Row label="Référence" value={receipt.reference} />
          <Row label="Date" value={receipt.date} />
          <Row label="Montant" value={formatFcfa(receipt.amount)} />
          <Row label="Moyen" value={receipt.method} />
          <Row label="Numéro" value={receipt.phone} />
          <Row label="Destinataire" value={receipt.destination} />
        </Card>

        <Text className="text-center font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
          Aucun paiement n'a eu lieu et aucune somme n'a été prélevée. Dans la version réelle, le don
          passera par Orange Money ou Mobicash et un vrai reçu sera envoyé.
        </Text>

        <View className="gap-3">
          <Button
            label="Partager le reçu"
            icon={Share2}
            variant="secondary"
            onPress={() =>
              Share.share({
                message: `Reçu fictif RoseLink (démonstration) : référence ${receipt.reference}, montant ${formatFcfa(
                  receipt.amount,
                )}. Aucun paiement n'a eu lieu.`,
              }).catch(() => {})
            }
          />
          <Button label="Faire un autre don" variant="ghost" onPress={reset} />
          <Button label="Retour" onPress={() => router.back()} />
        </View>
        <Disclaimer />
      </Screen>
    );
  }

  return (
    <Screen padTop={false}>
      <View className="flex-row items-start gap-2 rounded-2xl bg-primary-soft p-4 dark:bg-primary-soft-dark">
        <Info size={18} color={colors.primary} style={{ marginTop: 1 }} />
        <Text className="flex-1 font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
          Version de démonstration : aucun paiement n'est effectué et aucune somme n'est prélevée.
          Votre numéro n'est pas enregistré.
        </Text>
      </View>

      <Card className="gap-6">
        <OptionGroup
          label="Montant du don"
          options={AMOUNTS}
          value={choice}
          onChange={setChoice}
          error={errors.amount}
        />
        {choice === "custom" ? (
          <Input
            label="Votre montant (F CFA)"
            value={custom}
            onChangeText={setCustom}
            keyboardType="number-pad"
            placeholder="Par exemple 15000"
          />
        ) : null}

        <OptionGroup
          label="Moyen de paiement"
          options={METHODS}
          value={method}
          onChange={setMethod}
          error={errors.method}
        />

        <Input
          label="Numéro Mobile Money"
          icon={Phone}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="8 chiffres"
          error={errors.phone}
        />

        <OptionGroup
          label="Où va votre don ?"
          options={DESTINATIONS}
          value={destination}
          onChange={setDestination}
        />
      </Card>

      <Button
        label={choice && amount > 0 ? `Confirmer le don de ${formatFcfa(amount)}` : "Confirmer le don"}
        onPress={submit}
      />
      <Disclaimer />
    </Screen>
  );
}