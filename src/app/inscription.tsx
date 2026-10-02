import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  Lock,
  MapPin,
  ShieldCheck,
  UserPlus,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import {
  AGE_OPTIONS,
  FAMILY_OPTIONS,
  LANGUAGE_OPTIONS,
  SCREENING_OPTIONS,
  STAGE_OPTIONS,
  type Account,
  type AgeRange,
  type FamilyHistory,
  type Language,
  type ProfileKind,
  type ScreeningStatus,
  type Stage,
} from "@/types/account";

type Draft = {
  firstName: string;
  lastName: string;
  identifier: string;
  password: string;
  profile: ProfileKind | null;
  ageRange: AgeRange | null;
  city: string;
  language: Language;
  screening: ScreeningStatus | null;
  familyHistory: FamilyHistory | null;
  stage: Stage | null;
  consent: boolean;
};

const EMPTY: Draft = {
  firstName: "",
  lastName: "",
  identifier: "",
  password: "",
  profile: null,
  ageRange: null,
  city: "",
  language: "fr",
  screening: null,
  familyHistory: null,
  stage: null,
  consent: false,
};

const STEPS = [
  { title: "Ton compte", subtitle: "Pour retrouver ton parcours." },
  { title: "Ton parcours", subtitle: "Pour adapter RoseLink à ta situation." },
  { title: "Ta santé", subtitle: "Facultatif. Tu peux passer ou répondre « Je ne sais pas »." },
];

function ChoiceCard({
  icon: Icon,
  title,
  text,
  selected,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      className={`flex-row items-center gap-3 rounded-2xl border-2 p-4 active:opacity-80 ${
        selected
          ? "border-primary bg-primary-soft dark:border-primary-dark dark:bg-primary-soft-dark"
          : "border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
      }`}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
        <Icon size={24} color={colors.primary} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">{title}</Text>
        <Text className="font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Inscription() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const validate = (current: number) => {
    const next: Record<string, string> = {};
    if (current === 0) {
      if (!draft.firstName.trim()) next.firstName = "Dis-nous comment t'appeler.";
      if (!draft.identifier.trim()) next.identifier = "Entre ton téléphone ou ton e-mail.";
      if (draft.password.length < 6) next.password = "Au moins 6 caractères.";
    }
    if (current === 1 && !draft.profile) next.profile = "Choisis ce qui te correspond.";
    if (current === 2 && !draft.consent) next.consent = "Merci de cocher cette case pour continuer.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (validate(step)) setStep(step + 1);
  };

  const goBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const submit = async () => {
    if (!validate(2)) return;
    const account: Account = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim() || undefined,
      identifier: draft.identifier.trim(),
      profile: draft.profile ?? "prevention",
      ageRange: draft.ageRange ?? undefined,
      city: draft.city.trim() || undefined,
      language: draft.language,
      screening: draft.profile === "prevention" ? draft.screening ?? undefined : undefined,
      familyHistory: draft.familyHistory ?? undefined,
      stage: draft.profile === "support" ? draft.stage ?? undefined : undefined,
      createdAt: new Date().toISOString(),
    };
    await signUp(account);
    router.replace("/");
  };

  return (
    <Screen padTop={false}>
      <View className="gap-3">
        <View className="flex-row gap-2">
          {STEPS.map((item, i) => (
            <View
              key={item.title}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: i <= step ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        <View className="gap-1">
          <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
            Étape {step + 1} sur {STEPS.length}
          </Text>
          <Text
            accessibilityRole="header"
            className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
          >
            {STEPS[step].title}
          </Text>
          <Text className="font-jakarta text-base text-ink-soft dark:text-ink-soft-dark">
            {STEPS[step].subtitle}
          </Text>
        </View>
      </View>

      {step === 0 ? (
        <Card className="gap-4">
          <Input
            label="Prénom"
            icon={UserRound}
            value={draft.firstName}
            onChangeText={(value) => set("firstName", value)}
            autoCapitalize="words"
            error={errors.firstName}
          />
          <Input
            label="Nom (facultatif)"
            icon={UserRound}
            value={draft.lastName}
            onChangeText={(value) => set("lastName", value)}
            autoCapitalize="words"
          />
          <Input
            label="Téléphone ou e-mail"
            icon={UserRound}
            value={draft.identifier}
            onChangeText={(value) => set("identifier", value)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            error={errors.identifier}
          />
          <Input
            label="Mot de passe"
            icon={Lock}
            value={draft.password}
            onChangeText={(value) => set("password", value)}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
        </Card>
      ) : null}

      {step === 1 ? (
        <View className="gap-5">
          <View className="gap-3">
            <ChoiceCard
              icon={ShieldCheck}
              title="Je viens pour la prévention"
              text="Signes, dépistage, centres, questions."
              selected={draft.profile === "prevention"}
              onPress={() => set("profile", "prevention")}
            />
            <ChoiceCard
              icon={HeartHandshake}
              title="Je suis déjà diagnostiquée"
              text="Soutien, témoignages, aide et accompagnement."
              selected={draft.profile === "support"}
              onPress={() => set("profile", "support")}
            />
            {errors.profile ? (
              <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">
                {errors.profile}
              </Text>
            ) : null}
          </View>
          <Card className="gap-5">
            <OptionGroup
              label="Ta tranche d'âge"
              options={AGE_OPTIONS}
              value={draft.ageRange}
              onChange={(value) => set("ageRange", value)}
            />
            <Input
              label="Ta ville (facultatif)"
              icon={MapPin}
              value={draft.city}
              onChangeText={(value) => set("city", value)}
              autoCapitalize="words"
            />
            <OptionGroup
              label="Langue préférée pour l'audio"
              options={LANGUAGE_OPTIONS}
              value={draft.language}
              onChange={(value) => set("language", value)}
            />
          </Card>
        </View>
      ) : null}

      {step === 2 ? (
        <View className="gap-5">
          <Card className="gap-5">
            {draft.profile === "support" ? (
              <OptionGroup
                label="Quel est le stade de ta maladie ?"
                hint="Ton équipe soignante peut te le préciser."
                options={STAGE_OPTIONS}
                value={draft.stage}
                onChange={(value) => set("stage", value)}
              />
            ) : (
              <OptionGroup
                label="As-tu déjà fait un dépistage ?"
                options={SCREENING_OPTIONS}
                value={draft.screening}
                onChange={(value) => set("screening", value)}
              />
            )}
            <OptionGroup
              label="Y a-t-il eu un cancer du sein dans ta famille ?"
              options={FAMILY_OPTIONS}
              value={draft.familyHistory}
              onChange={(value) => set("familyHistory", value)}
            />
          </Card>

          <Pressable
            onPress={() => set("consent", !draft.consent)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: draft.consent }}
            className="min-h-11 flex-row items-start gap-3"
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: draft.consent ? colors.primary : colors.border,
                backgroundColor: draft.consent ? colors.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              {draft.consent ? <Check size={16} color={colors.onPrimary} strokeWidth={3} /> : null}
            </View>
            <Text className="flex-1 font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
              J'accepte que ces informations soient enregistrées sur ce téléphone pour personnaliser
              RoseLink. Je peux les effacer à tout moment.
            </Text>
          </Pressable>
          {errors.consent ? (
            <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">
              {errors.consent}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View className="gap-3">
        {step < STEPS.length - 1 ? (
          <Button label="Continuer" icon={ArrowRight} onPress={goNext} />
        ) : (
          <Button label="Créer mon compte" icon={UserPlus} onPress={submit} />
        )}
        {step > 0 ? (
          <Button label="Retour" icon={ArrowLeft} variant="secondary" onPress={goBack} />
        ) : (
          <Pressable
            onPress={() => router.replace("/connexion")}
            accessibilityRole="link"
            className="min-h-11 items-center justify-center"
          >
            <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
              Déjà un compte ? Connecte-toi
            </Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}