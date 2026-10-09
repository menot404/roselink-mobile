import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { notificationText, type NotificationKind } from "@/features/discret/notification-texts";

import { nextMonthlyDates, type ReminderConfig } from "./schedule";

const CHANNEL_ID = "rappels";
const TRIGGER = Notifications.SchedulableTriggerInputTypes;

export type Permission = "granted" | "undetermined" | "denied";

/** À appeler au démarrage : les rappels s'affichent aussi quand l'application est ouverte. */
export function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Rappels",
    importance: Notifications.AndroidImportance.DEFAULT,
    // le contenu est masqué sur l'écran verrouillé
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
  });
}

export async function getPermission(): Promise<Permission> {
  const result = await Notifications.getPermissionsAsync();
  if (result.granted) return "granted";
  return result.canAskAgain ? "undetermined" : "denied";
}

export async function requestPermission(): Promise<boolean> {
  await ensureChannel();
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

type Options = { discreet: boolean; support: boolean };

/**
 * Reprogramme tous les rappels. Les rappels mensuels sont programmés pour les 3 prochains mois :
 * l'opération est refaite à chaque ouverture de l'application, ce qui renouvelle la fenêtre.
 */
export async function scheduleAll(config: ReminderConfig, { discreet, support }: Options) {
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();

  const content = (kind: NotificationKind) => ({
    ...notificationText(kind, discreet),
    data: { kind },
    sound: false,
  });

  if (config.selfExam.enabled) {
    for (const date of nextMonthlyDates(now, config.selfExam.day, config.selfExam.hour)) {
      await Notifications.scheduleNotificationAsync({
        content: content("selfExam"),
        trigger: { type: TRIGGER.DATE, date, channelId: CHANNEL_ID },
      });
    }
  }

  if (config.mood.enabled) {
    await Notifications.scheduleNotificationAsync({
      content: content("mood"),
      trigger: { type: TRIGGER.DAILY, hour: config.mood.hour, minute: 0, channelId: CHANNEL_ID },
    });
  }

  if (support && config.medication.enabled) {
    await Notifications.scheduleNotificationAsync({
      content: content("medication"),
      trigger: {
        type: TRIGGER.DAILY,
        hour: config.medication.hour,
        minute: 0,
        channelId: CHANNEL_ID,
      },
    });
  }

  if (config.appointment.enabled && config.appointment.at) {
    const at = new Date(config.appointment.at);
    if (at.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: content("appointment"),
        trigger: { type: TRIGGER.DATE, date: at, channelId: CHANNEL_ID },
      });
    }
  }
}

/** Un rappel d'essai, dans 5 secondes : pratique pour la démonstration. */
export async function scheduleTest(kind: NotificationKind, discreet: boolean) {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: { ...notificationText(kind, discreet), data: { kind }, sound: false },
    trigger: { type: TRIGGER.TIME_INTERVAL, seconds: 5, channelId: CHANNEL_ID },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}