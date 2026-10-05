/** 10000 donne « 10 000 F CFA » (espace insécable fine entre les milliers). */
export function formatFcfa(amount: number) {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return `${grouped} F CFA`;
}

/** Référence fictive, par exemple RL-20261004-A3F9. */
export function makeReference(prefix: string) {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ymd}-${random}`;
}

/** Accepte un numéro burkinabè à 8 chiffres, avec ou sans l'indicatif 226. Retourne null sinon. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00226")) digits = digits.slice(5);
  else if (digits.startsWith("226") && digits.length === 11) digits = digits.slice(3);
  return digits.length === 8 ? digits : null;
}

export function maskPhone(digits: string) {
  return `•• •• •• ${digits.slice(-2)}`;
}

export function formatDateTimeFr(date: Date) {
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} à ${two(
    date.getHours(),
  )}:${two(date.getMinutes())}`;
}