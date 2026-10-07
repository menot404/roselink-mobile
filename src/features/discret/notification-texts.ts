export type NotificationKind = "selfExam" | "appointment" | "mood" | "medication";

type Text = { title: string; body: string };

/** Textes explicites, pour les personnes qui n'ont pas besoin de discrétion. */
const EXPLICIT: Record<NotificationKind, Text> = {
  selfExam: {
    title: "Votre geste mensuel",
    body: "C'est le moment de connaître vos seins. Cela prend cinq minutes.",
  },
  appointment: {
    title: "Rendez-vous de santé",
    body: "Vous avez un rendez-vous prévu bientôt. Pensez à vos questions.",
  },
  mood: {
    title: "Votre journal d'humeur",
    body: "Comment vous sentez-vous aujourd'hui ?",
  },
  medication: {
    title: "Rappel de traitement",
    body: "Pensez à votre traitement et à noter comment vous vous sentez.",
  },
};

/** Textes sans aucun mot lié à la santé : personne ne peut deviner de quoi il s'agit. */
const DISCREET: Record<NotificationKind, Text> = {
  selfExam: { title: "Un moment pour vous", body: "Prenez cinq minutes pour vous aujourd'hui." },
  appointment: { title: "Petit rappel", body: "Vous avez quelque chose de prévu bientôt." },
  mood: { title: "Un moment pour vous", body: "Comment s'est passée votre journée ?" },
  medication: { title: "Petit rappel", body: "N'oubliez pas votre rappel de la journée." },
};

export function notificationText(kind: NotificationKind, discreet: boolean): Text {
  return discreet ? DISCREET[kind] : EXPLICIT[kind];
}

/** Mots qui ne doivent jamais apparaître dans une notification discrète. */
export const FORBIDDEN_IN_DISCREET = [
  "cancer",
  "sein",
  "seins",
  "mammographie",
  "dépistage",
  "depistage",
  "traitement",
  "chimio",
  "santé",
  "sante",
  "médecin",
  "medecin",
  "malade",
  "maladie",
  "geste",
  "humeur",
];