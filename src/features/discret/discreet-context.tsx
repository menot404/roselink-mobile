import { createContext, useContext } from "react";

import type { DiscreetSettings } from "./settings";

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "wrong"; attemptsLeft: number }
  | { ok: false; reason: "locked"; seconds: number };

export type DiscreetContextValue = {
  ready: boolean;
  settings: DiscreetSettings;
  hasPin: boolean;
  locked: boolean;
  updateSettings: (changes: Partial<DiscreetSettings>) => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  /** Vérifie le code : compte les échecs et applique le blocage temporaire */
  verifyPin: (pin: string) => Promise<VerifyResult>;
  /** Vérifie le code puis déverrouille */
  unlock: (pin: string) => Promise<VerifyResult>;
  /** Déverrouille après une reconnaissance biométrique réussie */
  markUnlocked: () => Promise<void>;
  removePin: (currentPin: string) => Promise<VerifyResult>;
  lockNow: () => void;
  /** Efface le code et les réglages de discrétion */
  eraseAll: () => Promise<void>;
};

export const DiscreetContext = createContext<DiscreetContextValue | null>(null);

export function useDiscreet() {
  const context = useContext(DiscreetContext);
  if (!context) throw new Error("useDiscreet doit être utilisé dans DiscreetProvider");
  return context;
}