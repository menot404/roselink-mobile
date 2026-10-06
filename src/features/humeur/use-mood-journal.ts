import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import type { MoodEntry, MoodId } from "./moods";

export const MOOD_KEY = "roselink.mood.entries";
const MAX_ENTRIES = 200;

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Journal d'humeur : il reste sur le téléphone, de la plus récente à la plus ancienne entrée. */
export function useMoodJournal() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(MOOD_KEY)
      .then((raw) => {
        if (!raw) return;
        try {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) setEntries(parsed as MoodEntry[]);
        } catch {
          // données illisibles : on repart d'un journal vide
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: MoodEntry[]) => {
    setEntries(next);
    AsyncStorage.setItem(MOOD_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const add = useCallback(
    (mood: MoodId, note: string) => {
      const entry: MoodEntry = {
        id: newId(),
        date: new Date().toISOString(),
        mood,
        note: note.trim(),
      };
      persist([entry, ...entries].slice(0, MAX_ENTRIES));
    },
    [entries, persist],
  );

  const remove = useCallback(
    (id: string) => persist(entries.filter((entry) => entry.id !== id)),
    [entries, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { entries, ready, add, remove, clear };
}