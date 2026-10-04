import { INTENTS } from "./knowledge";
import type { ChatReply, Intent } from "./knowledge/types";
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

const COMPILED = INTENTS.map(compile);

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

export const FALLBACK_REPLY: ChatReply = {
  intentId: null,
  text: "Je ne suis pas sûre de bien comprendre. Je ne remplace pas un professionnel de santé, mais je peux vous parler des signes à connaître, du dépistage, des centres et de la gratuité au Burkina Faso. Pouvez-vous reformuler ?",
  actions: [],
  followUps: [],
  sourceIds: [],
  needsReview: false,
  isFallback: true,
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

/** Cherche la meilleure réponse. `lastIntentId` permet de comprendre un simple « oui ». */
export function getReply(message: string, lastIntentId: string | null = null): ChatReply {
  const text = normalize(message);
  if (!text) return FALLBACK_REPLY;
  const tokens = text.split(" ");

  if (CONFIRMATIONS.has(text) && lastIntentId) {
    const last = INTENTS.find((intent) => intent.id === lastIntentId);
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
  for (const compiled of COMPILED) {
    const value = score(compiled, text, tokens);
    if (value === 0) continue;
    const priority = compiled.intent.priority ?? 0;
    if (priority >= 100) return toReply(compiled.intent); // sécurité : réponse immédiate
    if (!best || value > best.score || (value === best.score && priority > (best.intent.priority ?? 0))) {
      best = { intent: compiled.intent, score: value };
    }
  }

  return best && best.score >= 2 ? toReply(best.intent) : FALLBACK_REPLY;
}
