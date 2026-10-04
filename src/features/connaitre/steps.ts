export type StepVisual =
  | "calendar"
  | "pose-down"
  | "pose-up"
  | "pose-hips"
  | "palpation-standing"
  | "palpation-lying"
  | "nipple-armpit"
  | "act";

export type SelfExamStep = {
  id: string;
  title: string;
  instruction: string;
  tips: string[];
  visual: StepVisual;
};

/** Contenu à faire valider par un professionnel de santé (sage-femme, médecin, infirmière). */
export const CONNAITRE_REVIEW: { validated: boolean; reviewer?: string; reviewedAt?: string } = {
  validated: false,
};

export const STEPS: SelfExamStep[] = [
  {
    id: "moment",
    title: "Choisissez le bon moment",
    instruction:
      "Une fois par mois, quelques jours après la fin de vos règles, quand les seins sont moins sensibles. Si vous n'avez plus de règles, choisissez un jour fixe du mois, par exemple le premier.",
    tips: ["La régularité compte plus que la perfection.", "Prenez cinq minutes au calme."],
    visual: "calendar",
  },
  {
    id: "miroir-bras-bas",
    title: "Regardez, bras le long du corps",
    instruction:
      "Debout devant un miroir, torse nu, observez vos seins : leur forme, leur taille, la couleur et l'aspect de la peau, les mamelons.",
    tips: [
      "Cherchez un changement récent : fossette, rougeur, peau d'orange, mamelon qui rentre.",
      "Il est fréquent que les deux seins ne soient pas parfaitement identiques.",
    ],
    visual: "pose-down",
  },
  {
    id: "miroir-bras-leves",
    title: "Regardez, bras levés",
    instruction:
      "Levez les deux bras au-dessus de la tête et observez de nouveau : le contour des seins, la peau sous les seins, le creux des aisselles.",
    tips: ["Un sein qui ne bouge pas comme l'autre, ou une peau qui se plisse, mérite d'être signalé."],
    visual: "pose-up",
  },
  {
    id: "mains-hanches",
    title: "Mains sur les hanches",
    instruction:
      "Posez les mains sur les hanches et appuyez fermement : les muscles de la poitrine se contractent. Observez une dernière fois la forme de vos seins.",
    tips: ["Regardez de face, puis légèrement de côté."],
    visual: "pose-hips",
  },
  {
    id: "palper-debout",
    title: "Palpez debout",
    instruction:
      "Levez le bras gauche. Avec les trois doigts du milieu de la main droite, à plat, faites de petits cercles sur tout le sein gauche, du mamelon vers l'extérieur, jusqu'à l'aisselle et jusqu'à la clavicule. Appuyez doucement, puis un peu plus fort. Puis changez de côté.",
    tips: [
      "La douche est un bon moment : la peau mouillée glisse mieux.",
      "Palpez tout le sein, sans oublier le haut et le côté.",
    ],
    visual: "palpation-standing",
  },
  {
    id: "palper-allongee",
    title: "Palpez allongée",
    instruction:
      "Allongez-vous avec un petit coussin sous l'épaule gauche et le bras gauche derrière la tête. Refaites les mêmes cercles avec la main droite, sur tout le sein et jusqu'à l'aisselle. Puis changez de côté.",
    tips: ["Allongée, le sein s'étale et se palpe plus facilement."],
    visual: "palpation-lying",
  },
  {
    id: "mamelon-aisselle",
    title: "Mamelons et aisselles",
    instruction:
      "Observez vos mamelons : écoulement, croûtes, peau qui pèle, mamelon qui rentre. Palpez aussi le creux de l'aisselle, à la recherche d'une boule ou d'un gonflement.",
    tips: ["Un écoulement, surtout s'il est sanglant, doit toujours être signalé à un professionnel."],
    visual: "nipple-armpit",
  },
  {
    id: "changement",
    title: "Si vous remarquez un changement",
    instruction:
      "Ne paniquez pas : la plupart des boules ne sont pas des cancers. Mais ne restez pas seule avec votre inquiétude : faites-vous examiner par un professionnel de santé, même si cela ne fait pas mal. Ce geste ne remplace pas le dépistage.",
    tips: ["Notez la date et l'endroit où vous avez remarqué le changement.", "Vous pouvez venir accompagnée."],
    visual: "act",
  },
];
