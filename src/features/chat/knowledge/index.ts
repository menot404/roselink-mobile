import { BURKINA_INTENTS } from "./intents-burkina";
import { DEPISTAGE_INTENTS } from "./intents-depistage";
import { SANTE_INTENTS } from "./intents-sante";
import { SIGNES_INTENTS } from "./intents-signes";
import { START_SUGGESTIONS, SYSTEM_INTENTS } from "./intents-system";
import { SUPPORT_EMOTION_INTENTS, SUPPORT_START_SUGGESTIONS } from "./support-emotions";
import { SUPPORT_TRAITEMENT_INTENTS } from "./support-traitements";
import { SUPPORT_VIE_INTENTS } from "./support-vie";
import type { Intent } from "./types";

export { SOURCES } from "./sources";
export { START_SUGGESTIONS, SUPPORT_START_SUGGESTIONS };

/** L'ordre compte : en cas d'égalité, la première intention l'emporte. */
export const PREVENTION_INTENTS: Intent[] = [
  ...SYSTEM_INTENTS,
  ...SIGNES_INTENTS,
  ...DEPISTAGE_INTENTS,
  ...BURKINA_INTENTS,
  ...SANTE_INTENTS,
];

export const SUPPORT_INTENTS: Intent[] = [
  ...SUPPORT_EMOTION_INTENTS,
  ...SUPPORT_TRAITEMENT_INTENTS,
  ...SUPPORT_VIE_INTENTS,
];

/** Ancien nom, conservé pour compatibilité */
export const INTENTS = PREVENTION_INTENTS;