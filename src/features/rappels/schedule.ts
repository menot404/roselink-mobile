export type ReminderConfig = {
  selfExam: { enabled: boolean; day: number; hour: number };
  mood: { enabled: boolean; hour: number };
  medication: { enabled: boolean; hour: number };
  /** « Me prévenir dans N jours à telle heure » : `at` est la date calculée du rappel */
  appointment: { enabled: boolean; days: number; hour: number; at: string | null };
};

export const DEFAULT_REMINDERS: ReminderConfig = {
  selfExam: { enabled: false, day: 5, hour: 18 },
  mood: { enabled: false, hour: 20 },
  medication: { enabled: false, hour: 8 },
  appointment: { enabled: false, days: 3, hour: 8, at: null },
};

/**
 * Prochaines dates mensuelles à l'heure donnée. Si le mois est plus court que le jour demandé
 * (le 31 en novembre), le rappel tombe le dernier jour du mois.
 */
export function nextMonthlyDates(now: Date, day: number, hour: number, count = 3): Date[] {
  const dates: Date[] = [];
  let year = now.getFullYear();
  let month = now.getMonth();
  while (dates.length < count) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const candidate = new Date(year, month, Math.min(day, lastDay), hour, 0, 0, 0);
    if (candidate.getTime() > now.getTime()) dates.push(candidate);
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return dates;
}

export function reminderDate(now: Date, daysAhead: number, hour: number): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead, hour, 0, 0, 0);
}