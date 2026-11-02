import { moodById, type MoodEntry, type MoodId } from "./moods";

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
const WEEKDAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];
const WEEKDAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const two = (value: number) => String(value).padStart(2, "0");

export type WeekDay = { key: string; letter: string; name: string; mood: MoodId | null };

/** Les 7 derniers jours (le plus ancien d'abord), avec l'humeur la plus récente de chaque jour. */
export function lastSevenDays(entries: MoodEntry[], now = new Date()): WeekDay[] {
  const days: WeekDay[] = [];
  for (let back = 6; back >= 0; back--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
    const key = dayKey(date);
    // les entrées sont classées de la plus récente à la plus ancienne
    const entry = entries.find((item) => dayKey(new Date(item.date)) === key);
    days.push({
      key,
      letter: WEEKDAY_LETTERS[date.getDay()],
      name: WEEKDAY_NAMES[date.getDay()],
      mood: entry?.mood ?? null,
    });
  }
  return days;
}

/** Vrai si au moins 3 des 5 dernières humeurs sont difficiles. Sert à proposer un soutien, pas à diagnostiquer. */
export function needsGentleSupport(entries: MoodEntry[]): boolean {
  const recent = entries.slice(0, 5);
  if (recent.length < 3) return false;
  return recent.filter((entry) => moodById(entry.mood).hard).length >= 3;
}

export function formatEntryDate(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} à ${two(date.getHours())}:${two(
    date.getMinutes(),
  )}`;
}