export const PIN_LENGTH = 4;
/** Nombre d'essais avant le premier blocage temporaire */
export const MAX_FREE_ATTEMPTS = 5;

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin);

/** Codes trop faciles à deviner : 0000, 1111, 1234, 4321… */
export function isWeakPin(pin: string): boolean {
  if (!isValidPin(pin)) return false;
  if (/^(\d)\1{3}$/.test(pin)) return true;
  const digits = pin.split("").map(Number);
  const rising = digits.every((digit, i) => i === 0 || digit === digits[i - 1] + 1);
  const falling = digits.every((digit, i) => i === 0 || digit === digits[i - 1] - 1);
  return rising || falling;
}

/** Secondes de blocage selon le nombre d'échecs consécutifs. */
export function lockoutSeconds(failCount: number): number {
  if (failCount < MAX_FREE_ATTEMPTS) return 0;
  if (failCount < 8) return 30;
  if (failCount < 10) return 120;
  return 600;
}