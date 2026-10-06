import { useRouter } from "expo-router";
import {
  Angry,
  BatteryLow,
  Check,
  Frown,
  Headphones,
  Meh,
  MessageCircleHeart,
  Smile,
  Trash2,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { SectionTitle } from "@/components/ui/section-title";
import { useAppTheme } from "@/context/theme-context";
import { formatEntryDate, lastSevenDays, needsGentleSupport } from "@/features/humeur/insights";
import { MOODS, moodById, type Mood, type MoodId } from "@/features/humeur/moods";
import { useMoodJournal } from "@/features/humeur/use-mood-journal";

const ICONS: Record<MoodId, LucideIcon> = {
  serene: Smile,
  fine: Meh,
  tired: BatteryLow,
  anxious: Waves,
  sad: Frown,
  angry: Angry,
};

export default function Humeur() {
  const router = useRouter();
  const { scheme, colors } = useAppTheme();
  const { entries, add, remove, clear } = useMoodJournal();

  const [selected, setSelected] = useState<MoodId | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const tone = (mood: Mood) => (scheme === "dark" ? mood.dark : mood.light);
  const onTone = scheme === "dark" ? "#1A0F15" : "#FFFFFF";
  const week = lastSevenDays(entries);
  const gentleSupport = needsGentleSupport(entries);

  const save = () => {
    if (!selected) {
      setError("Choisissez ce que vous ressentez.");
      return;
    }
    add(selected, note);
    setSelected(null);
    setNote("");
    setError("");
    setSaved(true);
  };

  const confirmRemove = (id: string) =>
    Alert.alert("Supprimer cette entrée ?", "Elle sera effacée de votre journal.", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => remove(id) },
    ]);

  const confirmClear = () =>
    Alert.alert("Effacer tout le journal ?", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      { text: "Tout effacer", style: "destructive", onPress: clear },
    ]);

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        Noter ce que vous ressentez aide à mieux vous comprendre. Ce journal reste sur votre
        téléphone.
      </Text>

      <Card className="gap-4">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-lg text-ink dark:text-ink-dark"
        >
          Comment vous sentez-vous maintenant ?
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {MOODS.map((mood) => {
            const isSelected = selected === mood.id;
            const Icon = ICONS[mood.id];
            return (
              <Pressable
                key={mood.id}
                onPress={() => {
                  setSelected(mood.id);
                  setError("");
                  setSaved(false);
                }}
                accessibilityRole="radio"
                accessibilityLabel={mood.label}
                accessibilityState={{ selected: isSelected }}
                style={{
                  flexBasis: "30%",
                  flexGrow: 1,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? tone(mood) : colors.border,
                  backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                }}
                className="min-h-24 items-center justify-center gap-2 rounded-2xl active:opacity-80"
              >
                <Icon size={30} color={tone(mood)} strokeWidth={2.2} />
                <Text className="font-jakarta-semibold text-sm text-ink dark:text-ink-dark">
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {error ? (
          <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">{error}</Text>
        ) : null}

        <Input
          label="Un mot pour vous (facultatif)"
          value={note}
          onChangeText={(value) => {
            setNote(value);
            setSaved(false);
          }}
          multiline
          maxLength={300}
          placeholder="Ce qui s'est passé, ce dont vous avez besoin…"
        />

        <Button label="Enregistrer" icon={Check} onPress={save} />
        {saved ? (
          <Text
            accessibilityLiveRegion="polite"
            className="text-center font-jakarta-medium text-sm text-success dark:text-success-dark"
          >
            C'est enregistré. Merci de prendre ce temps pour vous.
          </Text>
        ) : null}
      </Card>

      <SectionTitle>Cette semaine</SectionTitle>
      <Card>
        <View className="flex-row justify-between">
          {week.map((day) => {
            const mood = day.mood ? moodById(day.mood) : null;
            const Icon = day.mood ? ICONS[day.mood] : null;
            return (
              <View
                key={day.key}
                accessible
                accessibilityLabel={`${day.name} : ${mood ? mood.label : "pas d'humeur notée"}`}
                className="items-center gap-1.5"
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: mood ? tone(mood) : "transparent",
                    borderWidth: mood ? 0 : 1.5,
                    borderColor: colors.border,
                    borderStyle: "dashed",
                  }}
                >
                  {Icon ? <Icon size={20} color={onTone} /> : null}
                </View>
                <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
                  {day.letter}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      {gentleSupport ? (
        <Card className="gap-3 bg-primary-soft dark:bg-primary-soft-dark">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            Ces derniers jours semblent difficiles
          </Text>
          <Text className="font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
            Vous n'êtes pas seule. Parler à une personne de confiance, à votre équipe soignante ou à
            une psychologue peut vraiment aider. Voici de quoi vous soutenir tout de suite.
          </Text>
          <Button
            label="Écouter un message de soutien"
            icon={Headphones}
            onPress={() => router.push({ pathname: "/audio", params: { id: "soutien-fr" } })}
          />
          <Button
            label="Respirer quelques minutes"
            icon={Wind}
            variant="secondary"
            onPress={() => router.push("/respiration")}
          />
          <Button
            label="Parler à l'assistante"
            icon={MessageCircleHeart}
            variant="secondary"
            onPress={() => router.push("/chat")}
          />
        </Card>
      ) : null}

      <SectionTitle>Historique</SectionTitle>
      {entries.length === 0 ? (
        <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
          Votre journal est vide pour l'instant.
        </Text>
      ) : (
        <View className="gap-3">
          {entries.slice(0, 30).map((entry) => {
            const mood = moodById(entry.mood);
            const Icon = ICONS[entry.mood];
            return (
              <View
                key={entry.id}
                className="flex-row items-start gap-3 rounded-2xl border border-line bg-surface p-3 dark:border-line-dark dark:bg-surface-dark"
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: tone(mood),
                  }}
                >
                  <Icon size={22} color={onTone} />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
                    {mood.label}
                  </Text>
                  <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
                    {formatEntryDate(entry.date)}
                  </Text>
                  {entry.note ? (
                    <Text className="mt-1 font-jakarta text-sm leading-5 text-ink dark:text-ink-dark">
                      {entry.note}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => confirmRemove(entry.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer cette entrée"
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
                >
                  <Trash2 size={18} color={colors.inkSoft} />
                </Pressable>
              </View>
            );
          })}
          <Button label="Effacer tout le journal" icon={Trash2} variant="danger" onPress={confirmClear} />
        </View>
      )}

      <Text className="text-center font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
        Ce journal n'est pas un outil de diagnostic et ne remplace pas un suivi psychologique.
      </Text>
      <Disclaimer />
    </Screen>
  );
}