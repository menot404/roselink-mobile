import { PREVENTION_INTENTS, SUPPORT_INTENTS } from "./knowledge";
import type { ChatMode, ChatReply, Intent } from "./knowledge/types";
import { editDistance, normalize } from "./normalize";

type Matcher = { kind: "phrase" | "word" | "prefix"; value: string; weight: number };
type Compiled = { intent: Intent; matchers: Matcher[] };

const compile = (intent: Intent): Compiled => ({
  intent,
  matchers: intent.keywords.map((raw): Matcher => {
    const value = normalize(raw.replace(/\*$/, ""));
    if (raw.endsWith("*")) return { kind: "prefix", value, weight: 2 };
    if (value.includes(" ")) {
      return { kind: "phrase", value, weight: 3 * value.split(" ").length };
    }
    return { kind: "word", value, weight: 2 };
  }),
});

function score({ matchers }: Compiled, text: string, tokens: string[]): number {
  const padded = ` ${text} `;
  let total = 0;
  for (const matcher of matchers) {
    if (matcher.kind === "phrase") {
      if (padded.includes(` ${matcher.value} `)) total += matcher.weight;
    } else if (matcher.kind === "prefix") {
      if (tokens.some((token) => token.startsWith(matcher.value))) total += matcher.weight;
    } else if (tokens.includes(matcher.value)) {
      total += matcher.weight;
    } else if (
      matcher.value.length >= 6 &&
      tokens.some(
        (token) =>
          Math.abs(token.length - matcher.value.length) <= 1 &&
          editDistance(token, matcher.value) <= 1,
      )
    ) {
      // faute de frappe probable
      total += 1;
    }
  }
  return total;
}

const toReply = (intent: Intent): ChatReply => ({
  intentId: intent.id,
  text: intent.reply,
  actions: intent.actions ?? [],
  followUps: intent.followUps ?? [],
  sourceIds: intent.sources ?? [],
  needsReview: intent.status === "review",
  isFallback: false,
});

const FALLBACKS: Record<ChatMode, ChatReply> = {
  prevention: {
    intentId: null,
    text: "Je ne suis pas sûre de bien comprendre. Je ne remplace pas un professionnel de santé, mais je peux vous parler des signes à connaître, du dépistage, des centres et de la gratuité au Burkina Faso. Pouvez-vous reformuler ?",
    actions: [],
    followUps: [],
    sourceIds: [],
    needsReview: false,
    isFallback: true,
  },
  support: {
    intentId: null,
    text: "Je ne suis pas sûre de bien comprendre, mais je suis là pour vous écouter. Voulez-vous m'en dire un peu plus ? Je ne remplace pas votre équipe soignante, mais je peux vous orienter.",
    actions: [],
    followUps: [],
    sourceIds: [],
    needsReview: false,
    isFallback: true,
  },
};

const CONFIRMATIONS = new Set([
  "oui",
  "ok",
  "d accord",
  "daccord",
  "bien sur",
  "volontiers",
  "vas y",
  "allez y",
  "s il vous plait",
  "svp",
]);

const BANKS: Record<ChatMode, { intents: Intent[]; compiled: Compiled[] }> = {
  prevention: { intents: PREVENTION_INTENTS, compiled: PREVENTION_INTENTS.map(compile) },
  support: { intents: SUPPORT_INTENTS, compiled: SUPPORT_INTENTS.map(compile) },
};

export const FALLBACK_REPLY = FALLBACKS.prevention;

/**
 * Cherche la meilleure réponse dans la base du mode choisi.
 * `lastIntentId` permet de comprendre un simple « oui ».
 */
export function getReply(
  message: string,
  lastIntentId: string | null = null,
  mode: ChatMode = "prevention",
): ChatReply {
  const bank = BANKS[mode];
  const fallback = FALLBACKS[mode];
  const text = normalize(message);
  if (!text) return fallback;
  const tokens = text.split(" ");

  if (CONFIRMATIONS.has(text) && lastIntentId) {
    const last = bank.intents.find((intent) => intent.id === lastIntentId);
    if (last?.followUps?.length) {
      return {
        intentId: "suite",
        text: "Très bien. Voici ce que je peux vous proposer :",
        actions: [],
        followUps: last.followUps,
        sourceIds: [],
        needsReview: false,
        isFallback: false,
      };
    }
  }

  let best: { intent: Intent; score: number } | null = null;
  for (const compiled of bank.compiled) {
    const value = score(compiled, text, tokens);
    if (value === 0) continue;
    const priority = compiled.intent.priority ?? 0;
    if (priority >= 100) return toReply(compiled.intent); // sécurité : réponse immédiate
    if (!best || value > best.score || (value === best.score && priority > (best.intent.priority ?? 0))) {
      best = { intent: compiled.intent, score: value };
    }
  }

  return best && best.score >= 2 ? toReply(best.intent) : fallback;
}