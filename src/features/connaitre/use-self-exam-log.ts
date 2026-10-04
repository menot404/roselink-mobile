import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export const SELF_EXAM_KEY = "roselink.selfexam.last";

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function formatFrenchDate(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Date du dernier geste mensuel. Reste sur le téléphone. */
export function useSelfExamLog() {
  const [lastDone, setLastDone] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SELF_EXAM_KEY)
      .then(setLastDone)
      .catch(() => {});
  }, []);

  const markDone = useCallback(async () => {
    const now = new Date().toISOString();
    setLastDone(now);
    try {
      await AsyncStorage.setItem(SELF_EXAM_KEY, now);
    } catch {}
  }, []);

  return { lastDone, markDone };
}
