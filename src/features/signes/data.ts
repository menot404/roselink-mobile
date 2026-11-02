export type SignId =
  | "boule"
  | "forme"
  | "peau"
  | "mamelon"
  | "ecoulement"
  | "croute"
  | "douleur";

export type Sign = { id: SignId; title: string; description: string };

export const SIGNS: Sign[] = [
  {
    id: "boule",
    title: "Boule ou grosseur",
    description: "Une boule ou une zone dure dans le sein ou sous l'aisselle.",
  },
  {
    id: "forme",
    title: "Changement de taille ou de forme",
    description: "Un sein qui change de forme, de taille ou de position.",
  },
  {
    id: "peau",
    title: "Changement de la peau",
    description: "Fossettes, plis, aspect de peau d'orange ou rougeur.",
  },
  {
    id: "mamelon",
    title: "Mamelon rentré",
    description: "Un mamelon qui rentre vers l'intérieur alors qu'il ne l'était pas avant.",
  },
  {
    id: "ecoulement",
    title: "Écoulement",
    description: "Un liquide qui sort du mamelon : sang, liquide clair ou jaune.",
  },
  {
    id: "croute",
    title: "Croûtes ou plaie",
    description: "Une peau du mamelon qui pèle, qui forme des croûtes ou qui ne guérit pas.",
  },
  {
    id: "douleur",
    title: "Douleur persistante",
    description: "Une douleur qui reste au même endroit, sans lien avec les règles.",
  },
];

export const KEY_POINTS: string[] = [
  "La plupart des boules ne sont pas des cancers, mais toute boule doit être examinée.",
  "L'absence de douleur ne veut pas dire absence de danger.",
  "Si vous remarquez l'un de ces signes, consultez sans attendre et sans avoir peur.",
];

/** Passer `validated` à true une fois le contenu relu par un professionnel de santé */
export const CONTENT_REVIEW: { validated: boolean; reviewer?: string; reviewedAt?: string } = {
  validated: false,
};