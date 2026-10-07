import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenCapture from "expo-screen-capture";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AppState, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

import { DiscreetContext, type DiscreetContextValue, type VerifyResult } from "./discreet-context";
import { LockScreen } from "./lock-screen";
import { MAX_FREE_ATTEMPTS, lockoutSeconds } from "./pin";
import { hashPin, randomSalt } from "./pin-crypto";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  loadSettings,
  saveSettings,
  type DiscreetSettings,
} from "./settings";

const HASH_KEY = "roselink.pin.hash";
const SALT_KEY = "roselink.pin.salt";
const FAILS_KEY = "roselink.pin.fails";
const UNTIL_KEY = "roselink.pin.lockuntil";
const ALL_KEYS = [HASH_KEY, SALT_KEY, FAILS_KEY, UNTIL_KEY];

/** Délai passé en arrière-plan avant de reverrouiller l'application */
const GRACE_MS = 30_000;

export function DiscreetProvider({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<DiscreetSettings>(DEFAULT_SETTINGS);
  const [hasPin, setHasPin] = useState(false);
  const [locked, setLocked] = useState(true);

  const backgroundedAt = useRef<number | null>(null);
  const fails = useRef(0);
  const lockUntil = useRef(0);

  // chargement initial : l'application reste verrouillée tant que ce n'est pas terminé
  useEffect(() => {
    (async () => {
      try {
        const [loaded, hash, savedFails, savedUntil] = await Promise.all([
          loadSettings(),
          SecureStore.getItemAsync(HASH_KEY),
          SecureStore.getItemAsync(FAILS_KEY),
          SecureStore.getItemAsync(UNTIL_KEY),
        ]);
        setSettings(loaded);
        setHasPin(Boolean(hash));
        setLocked(Boolean(hash));
        fails.current = Number(savedFails) || 0;
        lockUntil.current = Number(savedUntil) || 0;
      } catch {
        setLocked(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // reverrouillage au retour dans l'application
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        backgroundedAt.current = Date.now();
      } else if (state === "active") {
        const left = backgroundedAt.current;
        backgroundedAt.current = null;
        if (hasPin && left !== null && Date.now() - left > GRACE_MS) setLocked(true);
      }
    });
    return () => subscription.remove();
  }, [hasPin]);

  // aperçu masqué et captures bloquées
  useEffect(() => {
    if (!ready) return;
    if (settings.hidePreview) {
      ScreenCapture.preventScreenCaptureAsync("roselink").catch(() => {});
    } else {
      ScreenCapture.allowScreenCaptureAsync("roselink").catch(() => {});
    }
  }, [ready, settings.hidePreview]);

  const updateSettings = useCallback(
    async (changes: Partial<DiscreetSettings>) => {
      const next = { ...settings, ...changes };
      setSettings(next);
      await saveSettings(next);
    },
    [settings],
  );

  const clearFailures = useCallback(async () => {
    fails.current = 0;
    lockUntil.current = 0;
    await Promise.all([
      SecureStore.deleteItemAsync(FAILS_KEY),
      SecureStore.deleteItemAsync(UNTIL_KEY),
    ]).catch(() => {});
  }, []);

  const verifyPin = useCallback(
    async (pin: string): Promise<VerifyResult> => {
      const now = Date.now();
      if (lockUntil.current > now) {
        return { ok: false, reason: "locked", seconds: Math.ceil((lockUntil.current - now) / 1000) };
      }

      const [salt, hash] = await Promise.all([
        SecureStore.getItemAsync(SALT_KEY),
        SecureStore.getItemAsync(HASH_KEY),
      ]);
      if (!salt || !hash) return { ok: true };

      if ((await hashPin(salt, pin)) === hash) {
        await clearFailures();
        return { ok: true };
      }

      fails.current += 1;
      const seconds = lockoutSeconds(fails.current);
      lockUntil.current = seconds > 0 ? Date.now() + seconds * 1000 : 0;
      await Promise.all([
        SecureStore.setItemAsync(FAILS_KEY, String(fails.current)),
        SecureStore.setItemAsync(UNTIL_KEY, String(lockUntil.current)),
      ]).catch(() => {});

      if (seconds > 0) return { ok: false, reason: "locked", seconds };
      return { ok: false, reason: "wrong", attemptsLeft: Math.max(0, MAX_FREE_ATTEMPTS - fails.current) };
    },
    [clearFailures],
  );

  const unlock = useCallback(
    async (pin: string) => {
      const result = await verifyPin(pin);
      if (result.ok) setLocked(false);
      return result;
    },
    [verifyPin],
  );

  const setPin = useCallback(
    async (pin: string) => {
      const salt = randomSalt();
      const hash = await hashPin(salt, pin);
      await Promise.all([
        SecureStore.setItemAsync(SALT_KEY, salt),
        SecureStore.setItemAsync(HASH_KEY, hash),
      ]);
      await clearFailures();
      setHasPin(true);
    },
    [clearFailures],
  );

  const removePin = useCallback(
    async (currentPin: string) => {
      const result = await verifyPin(currentPin);
      if (!result.ok) return result;
      await Promise.all(ALL_KEYS.map((key) => SecureStore.deleteItemAsync(key))).catch(() => {});
      setHasPin(false);
      setLocked(false);
      return result;
    },
    [verifyPin],
  );

  const lockNow = useCallback(() => {
    if (hasPin) setLocked(true);
  }, [hasPin]);

  const eraseAll = useCallback(async () => {
    await Promise.all([
      ...ALL_KEYS.map((key) => SecureStore.deleteItemAsync(key)),
      AsyncStorage.removeItem(SETTINGS_KEY),
    ]).catch(() => {});
    fails.current = 0;
    lockUntil.current = 0;
    setSettings(DEFAULT_SETTINGS);
    setHasPin(false);
    setLocked(false);
  }, []);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.canvas }} />;

  const value: DiscreetContextValue = {
    ready,
    settings,
    hasPin,
    locked,
    updateSettings,
    setPin,
    verifyPin,
    unlock,
    removePin,
    lockNow,
    eraseAll,
  };

  return (
    <DiscreetContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {locked && hasPin ? <LockScreen /> : null}
      </View>
    </DiscreetContext.Provider>
  );
}