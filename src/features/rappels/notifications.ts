import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

import { notificationText, type NotificationKind } from "@/features/discret/notification-texts";

import { nextMonthlyDates, type ReminderConfig } from "./schedule";

type NotificationsModule = typeof import("expo-notifications");

const CHANNEL_ID = "rappels";

export type Permission = "granted" | "undetermined" | "denied" | "unavailable";

/** Dans Expo Go sur Android, l'import même de expo-notifications échoue depuis le SDK 53. */
export const IN_EXPO_GO_ANDROID =
  Platform.OS === "android" && Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let cached: NotificationsModule | null | undefined;

/** Charge expo-notifications seulement quand c'est possible. */
function loadNotifications(): NotificationsModule | null {
  if (IN_EXPO_GO_ANDROID) return null;
  if (cached === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      cached = require("expo-notifications") as NotificationsModule;
    } catch {
      cached = null;
    }
  }
  return cached;
}

/** À appeler au démarrage : les rappels s'affichent aussi quand l'application est ouverte. */
export function setupNotifications() {
  const N = loadNotifications();
  if (!N) return;
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel(N: NotificationsModule) {
  if (Platform.OS !== "android") return;
  await N.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Rappels",
    importance: N.AndroidImportance.DEFAULT,
    // le contenu est masqué sur l'écran verrouillé
    lockscreenVisibility: N.AndroidNotificationVisibility.PRIVATE,
  });
}

export async function getPermission(): Promise<Permission> {
  const N = loadNotifications();
  if (!N) return "unavailable";
  const result = await N.getPermissionsAsync();
  if (result.granted) return "granted";
  return result.canAskAgain ? "undetermined" : "denied";
}

export async function requestPermission(): Promise<boolean> {
  const N = loadNotifications();
  if (!N) return false;
  await ensureChannel(N);
  const result = await N.requestPermissionsAsync();
  return result.granted;
}

type Options = { discreet: boolean; support: boolean };

/**
 * Reprogramme tous les rappels. Les rappels mensuels sont programmés pour les 3 prochains mois :
 * l'opération est refaite à chaque ouverture de l'application, ce qui renouvelle la fenêtre.
 */
export async function scheduleAll(config: ReminderConfig, { discreet, support }: Options) {
  const N = loadNotifications();
  if (!N) return;
  const TRIGGER = N.SchedulableTriggerInputTypes;

  await ensureChannel(N);
  await N.cancelAllScheduledNotificationsAsync();
  const now = new Date();

  const content = (kind: NotificationKind) => ({
    ...notificationText(kind, discreet),
    data: { kind },
    sound: false,
  });

  if (config.selfExam.enabled) {
    for (const date of nextMonthlyDates(now, config.selfExam.day, config.selfExam.hour)) {
      await N.scheduleNotificationAsync({
        content: content("selfExam"),
        trigger: { type: TRIGGER.DATE, date, channelId: CHANNEL_ID },
      });
    }
  }

  if (config.mood.enabled) {
    await N.scheduleNotificationAsync({
      content: content("mood"),
      trigger: { type: TRIGGER.DAILY, hour: config.mood.hour, minute: 0, channelId: CHANNEL_ID },
    });
  }

  if (support && config.medication.enabled) {
    await N.scheduleNotificationAsync({
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
      await N.scheduleNotificationAsync({
        content: content("appointment"),
        trigger: { type: TRIGGER.DATE, date: at, channelId: CHANNEL_ID },
      });
    }
  }
}

/** Un rappel d'essai, dans 5 secondes : pratique pour la démonstration. */
export async function scheduleTest(kind: NotificationKind, discreet: boolean): Promise<boolean> {
  const N = loadNotifications();
  if (!N) return false;
  await ensureChannel(N);
  await N.scheduleNotificationAsync({
    content: { ...notificationText(kind, discreet), data: { kind }, sound: false },
    trigger: {
      type: N.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}

export async function cancelAllReminders() {
  const N = loadNotifications();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
}