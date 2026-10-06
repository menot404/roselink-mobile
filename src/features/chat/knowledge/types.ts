export type SourceId =
  | "who-bc"
  | "who-bcam"
  | "afro-bf"
  | "inca"
  | "sidwaya"
  | "fasoamazone"
  | "apidpm"
  | "lepays"
  | "zcf"
  | "sante-bf"
  | "msd"
  | "quotidien"
  | "burkina24-or"
  | "burkina24-mt"
  | "minute-mt"
  | "icm"
  | "gustave-roussy"
  | "chuv"
  | "cusm"
  | "hug"
  | "ciusss"
  | "inca-image"
  | "inca-recon";

export type Source = {
  id: SourceId;
  title: string;
  /** Nom court affiché dans le chat */
  short: string;
  publisher: string;
  url: string;
  /** Date de publication ou de mise à jour connue */
  date?: string;
  kind: "officielle" | "presse" | "reference-medicale";
};

export type ChatRoute =
  | "/carte"
  | "/signes"
  | "/association"
  | "/parcours"
  | "/connaitre"
  | "/mythes"
  | "/audio";
export type ChatAction = {
  label: string;
  href: ChatRoute;
  /** Paramètres de la page, par exemple { id: "respiration-fr" } */
  params?: Record<string, string>;
};
export type Intent = {
  id: string;
  /** Mots-clés : "mot", "plusieurs mots" (expression exacte) ou "racine*" (début de mot) */
  keywords: string[];
  reply: string;
  actions?: ChatAction[];
  /** Questions proposées ensuite. Chacune doit être comprise par le moteur. */
  followUps?: string[];
  sources?: SourceId[];
  /** "sourced" : appuyé par une source officielle. "review" : à faire valider par un professionnel avant publication. */
  status: "sourced" | "review";
  /** 100 ou plus : réponse immédiate (sécurité) */
  priority?: number;
};

/** Deux espaces de discussion : prévention et accompagnement */
export type ChatMode = "prevention" | "support";
export type ChatReply = {
  intentId: string | null;
  text: string;
  actions: ChatAction[];
  followUps: string[];
  sourceIds: SourceId[];
  needsReview: boolean;
  isFallback: boolean;
};
