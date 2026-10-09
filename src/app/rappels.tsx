import { Bell, BellRing } from "lucide-react-native";
import { useState } from "react";
import { Linking, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { OptionGroup } from "@/components/ui/option-group";
import { Screen } from "@/components/ui/screen";
import { ToggleRow } from "@/components/ui/toggle-row";
import { useAuth } from "@/context/auth-context";
import { useDiscreet } from "@/features/discret/discreet-context";
import { notificationText } from "@/features/discret/notification-texts";
import { formatEntryDate } from "@/features/humeur/insights";
import { scheduleTest } from "@/features/rappels/notifications";
import { reminderDate, type ReminderConfig } from "@/features/rappels/schedule";
import { useReminders } from "@/features/rappels/use-reminders";
import type { Option } from "@/types/account";

const HOURS: Option<string>[] = [
  { value: "8", label: "8 h" },
  { value: "12", label: "12 h" },
  { value: "18", label: "18 h" },
  { value: "20", label: "20 h" },
];

const DAYS: Option<string>[] = [
  { value: "1", label: "Le 1er" },
  { value: "5", label: "Le 5" },
  { value: "10", label: "Le 10" },
  { value: "15", label: "Le 15" },
  { value: "20", label: "Le 20" },
  { value: "25", label: "Le 25" },
];

const AHEAD: Option<string>[] = [
  { value: "1", label: "Demain" },
  { value: "3", label: "Dans 3 jours" },
  { value: "7", label: "Dans 1 semaine" },
  { value: "14", label: "Dans 2 semaines" },
];

export default function Rappels() {
  const { user } = useAuth();
  const { settings } = useDiscreet();
  const { config, loaded, permission, persist, askPermission, scheduleAll } =
    useReminders();
  const [info, setInfo] = useState("");

  const support = user?.profile === "support";
  const discreet = settings.discreetNotifications;
  const preview = notificationText("selfExam", discreet);

  /** Enregistre, demande l'autorisation si besoin, puis reprogramme les rappels. */
  const change = async (next: ReminderConfig) => {
    const anyEnabled =
      next.selfExam.enabled ||
      next.mood.enabled ||
      next.medication.enabled ||
      next.appointment.enabled;
    let allowed = permission === "granted";
    if (anyEnabled && !allowed && permission !== "unavailable")
      allowed = await askPermission();
    await persist(next);
    if (allowed) await scheduleAll(next, { discreet, support });
  };

  const runTest = async () => {
    if (permission === "unavailable") {
      setInfo(
        "Les rappels fonctionnent dans l'application installée (APK), pas dans Expo Go.",
      );
      return;
    }
    const allowed = permission === "granted" || (await askPermission());
    if (!allowed) {
      setInfo(
        "Les notifications sont refusées : autorisez-les dans les réglages du téléphone.",
      );
      return;
    }
    await scheduleTest("selfExam", discreet);
    setInfo("Un rappel arrive dans 5 secondes : regardez le haut de l'écran.");
  };

  const setAppointment = (days: number, hour: number, enabled: boolean) =>
    change({
      ...config,
      appointment: {
        enabled,
        days,
        hour,
        at: reminderDate(new Date(), days, hour).toISOString(),
      },
    });

  if (!loaded) return null;

  const appointmentAt = config.appointment.at
    ? new Date(config.appointment.at)
    : null;
  const appointmentPast =
    appointmentAt !== null && appointmentAt.getTime() <= Date.now();

  return (
    <Screen padTop={false}>
      <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
        Des petits rappels pour penser à vous. Ils sont programmés sur votre
        téléphone : rien n'est envoyé sur Internet.
      </Text>

      {permission === "denied" ? (
        <Card className="gap-3">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            Les notifications sont désactivées
          </Text>
          <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
            Autorisez RoseLink à envoyer des notifications dans les réglages du
            téléphone pour recevoir vos rappels.
          </Text>
          <Button
            label="Ouvrir les réglages du téléphone"
            variant="secondary"
            onPress={() => Linking.openSettings().catch(() => { })}
          />
        </Card>
      ) : null}

      {permission === "unavailable" ? (
        <Card className="gap-2">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            Rappels indisponibles dans Expo Go
          </Text>
          <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
            Sur Android, Expo Go ne permet plus d'utiliser les notifications. Vos choix sont enregistrés,
            et les rappels fonctionneront dans l'application installée (APK).
          </Text>
        </Card>
      ) : null}

      <Card className="gap-5">
        <ToggleRow
          label="Geste mensuel"
          description="Un rappel chaque mois pour connaître vos seins."
          value={config.selfExam.enabled}
          onValueChange={(enabled) =>
            void change({
              ...config,
              selfExam: { ...config.selfExam, enabled },
            })
          }
        />
        {config.selfExam.enabled ? (
          <>
            <OptionGroup
              label="Quel jour du mois ?"
              hint="Quelques jours après la fin de vos règles, si vous en avez."
              options={DAYS}
              value={String(config.selfExam.day)}
              onChange={(value) =>
                void change({
                  ...config,
                  selfExam: { ...config.selfExam, day: Number(value) },
                })
              }
            />
            <OptionGroup
              label="À quelle heure ?"
              options={HOURS}
              value={String(config.selfExam.hour)}
              onChange={(value) =>
                void change({
                  ...config,
                  selfExam: { ...config.selfExam, hour: Number(value) },
                })
              }
            />
          </>
        ) : null}
      </Card>

      <Card className="gap-5">
        <ToggleRow
          label="Journal d'humeur"
          description="Un rappel chaque jour pour noter comment vous vous sentez."
          value={config.mood.enabled}
          onValueChange={(enabled) =>
            void change({ ...config, mood: { ...config.mood, enabled } })
          }
        />
        {config.mood.enabled ? (
          <OptionGroup
            label="À quelle heure ?"
            options={HOURS}
            value={String(config.mood.hour)}
            onChange={(value) =>
              void change({
                ...config,
                mood: { ...config.mood, hour: Number(value) },
              })
            }
          />
        ) : null}
      </Card>

      {support ? (
        <Card className="gap-5">
          <ToggleRow
            label="Rappel quotidien de traitement"
            description="Un rappel pour penser à votre traitement. Il ne remplace pas les consignes de votre équipe soignante."
            value={config.medication.enabled}
            onValueChange={(enabled) =>
              void change({
                ...config,
                medication: { ...config.medication, enabled },
              })
            }
          />
          {config.medication.enabled ? (
            <OptionGroup
              label="À quelle heure ?"
              options={HOURS}
              value={String(config.medication.hour)}
              onChange={(value) =>
                void change({
                  ...config,
                  medication: { ...config.medication, hour: Number(value) },
                })
              }
            />
          ) : null}
        </Card>
      ) : null}

      <Card className="gap-5">
        <ToggleRow
          label="Rendez-vous de santé"
          description="Un rappel unique avant un rendez-vous ou un dépistage."
          value={config.appointment.enabled}
          onValueChange={(enabled) =>
            void setAppointment(
              config.appointment.days,
              config.appointment.hour,
              enabled,
            )
          }
        />
        {config.appointment.enabled ? (
          <>
            <OptionGroup
              label="Me prévenir"
              options={AHEAD}
              value={String(config.appointment.days)}
              onChange={(value) =>
                void setAppointment(
                  Number(value),
                  config.appointment.hour,
                  true,
                )
              }
            />
            <OptionGroup
              label="À quelle heure ?"
              options={HOURS}
              value={String(config.appointment.hour)}
              onChange={(value) =>
                void setAppointment(
                  config.appointment.days,
                  Number(value),
                  true,
                )
              }
            />
            {appointmentAt ? (
              <Text className="font-jakarta-medium text-sm text-ink-soft dark:text-ink-soft-dark">
                {appointmentPast
                  ? "Ce rappel est passé : choisissez une nouvelle date."
                  : `Rappel prévu le ${formatEntryDate(appointmentAt.toISOString())}.`}
              </Text>
            ) : null}
          </>
        ) : null}
      </Card>

      <Card className="gap-3">
        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
          À quoi ressemble un rappel ?
        </Text>
        <View className="gap-1 rounded-2xl bg-primary-soft p-4 dark:bg-primary-soft-dark">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            {preview.title}
          </Text>
          <Text className="font-jakarta text-sm text-ink dark:text-ink-dark">
            {preview.body}
          </Text>
        </View>
        <Text className="font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          {discreet
            ? "Notifications discrètes activées : aucun mot lié à la santé. Vous pouvez changer cela dans le Mode discret."
            : "Notifications explicites. Activez les notifications discrètes dans le Mode discret si vous craignez le regard de votre entourage."}
        </Text>
        <Button
          label="Tester un rappel"
          icon={BellRing}
          variant="secondary"
          onPress={runTest}
        />
        {info ? (
          <Text
            accessibilityLiveRegion="polite"
            className="font-jakarta-medium text-sm text-success dark:text-success-dark"
          >
            {info}
          </Text>
        ) : null}
      </Card>

      <View className="flex-row items-center justify-center gap-2">
        <Bell size={14} color="#B02558" />
        <Text className="flex-1 text-center font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          Dans la version réelle, des rappels par SMS seront possibles pour les
          téléphones sans smartphone.
        </Text>
      </View>
      <Disclaimer />
    </Screen>
  );
}
