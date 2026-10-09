import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useDiscreet } from "@/features/discret/discreet-context";

import {
  cancelAllReminders,
  getPermission,
  requestPermission,
  scheduleAll,
  setupNotifications,
  type Permission,
} from "./notifications";
import { DEFAULT_REMINDERS, type ReminderConfig } from "./schedule";

export const REMINDERS_KEY = "roselink.reminders";

export async function loadReminders(): Promise<ReminderConfig> {
  try {
    const raw = await AsyncStorage.getItem(REMINDERS_KEY);
    if (!raw) return DEFAULT_REMINDERS;
    const saved = JSON.parse(raw) as Partial<ReminderConfig>;
    return {
      selfExam: { ...DEFAULT_REMINDERS.selfExam, ...saved.selfExam },
      mood: { ...DEFAULT_REMINDERS.mood, ...saved.mood },
      medication: { ...DEFAULT_REMINDERS.medication, ...saved.medication },
      appointment: { ...DEFAULT_REMINDERS.appointment, ...saved.appointment },
    };
  } catch {
    return DEFAULT_REMINDERS;
  }
}

/** Efface les réglages de rappels et annule toutes les notifications programmées. */
export async function clearReminders() {
  await AsyncStorage.removeItem(REMINDERS_KEY).catch(() => {});
  await cancelAllReminders().catch(() => {});
}

/** À appeler une fois, quand l'application est ouverte et connectée : renouvelle les rappels. */
export function useReminderBootstrap() {
  const { user } = useAuth();
  const { ready, settings } = useDiscreet();

  useEffect(() => {
    if (!ready) return;
    setupNotifications();
    (async () => {
      if ((await getPermission()) !== "granted") return;
      const config = await loadReminders();
      await scheduleAll(config, {
        discreet: settings.discreetNotifications,
        support: user?.profile === "support",
      });
    })().catch(() => {});
  }, [ready, settings.discreetNotifications, user?.profile]);
}

export function useReminders() {
  const [config, setConfig] = useState<ReminderConfig>(DEFAULT_REMINDERS);
  const [loaded, setLoaded] = useState(false);
  const [permission, setPermission] = useState<Permission>("undetermined");

  useEffect(() => {
    (async () => {
      setConfig(await loadReminders());
      setPermission(await getPermission());
      setLoaded(true);
    })().catch(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (next: ReminderConfig) => {
    setConfig(next);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const askPermission = useCallback(async () => {
    const granted = await requestPermission();
    setPermission(granted ? "granted" : await getPermission());
    return granted;
  }, []);

  return { config, loaded, permission, persist, askPermission, scheduleAll };
}