import { BURKINA_INTENTS } from "./intents-burkina";
import { DEPISTAGE_INTENTS } from "./intents-depistage";
import { SANTE_INTENTS } from "./intents-sante";
import { SIGNES_INTENTS } from "./intents-signes";
import { START_SUGGESTIONS, SYSTEM_INTENTS } from "./intents-system";
import type { Intent } from "./types";

export { SOURCES } from "./sources";
export { START_SUGGESTIONS };

/** L'ordre compte : en cas d'égalité, la première intention l'emporte. */
export const INTENTS: Intent[] = [
  ...SYSTEM_INTENTS,
  ...SIGNES_INTENTS,
  ...DEPISTAGE_INTENTS,
  ...BURKINA_INTENTS,
  ...SANTE_INTENTS,
];
