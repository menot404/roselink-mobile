import type { Language } from "@/types/account";

export type AudioTheme = "signes" | "geste" | "depistage" | "soutien" | "respiration" | "mythes";

export type AudioExpert = { name: string; role: string; organization?: string };

export type AudioTrack = {
  id: string;
  title: string;
  theme: AudioTheme;
  /** Public concerné */
  module: "prevention" | "support";
  language: Language;
  /** Durée annoncée : la durée réelle du fichier prend le relais une fois chargé */
  durationSec: number;
  /** Résultat de require("…") */
  source: number;
  /** Texte lu dans l'enregistrement, affiché pour l'accessibilité */
  transcript: string;
  expert: AudioExpert;
  status: "pending" | "validated" | "rejected";
  validatedAt?: string;
  /** Consentement de l'expert signé : sans lui, l'audio n'est pas publié */
  consentSigned: boolean;
  /** Enregistrement de démonstration (son de remplacement) */
  demo: boolean;
};

export const THEME_LABELS: Record<AudioTheme, string> = {
  signes: "Signes d'alerte",
  geste: "Connaître ses seins",
  depistage: "Dépistage",
  soutien: "Soutien",
  respiration: "Détente",
  mythes: "Idées reçues",
};