export type Story = {
  id: string;
  firstName: string;
  theme: string;
  readingMinutes: number;
  paragraphs: string[];
};

/**
 * HISTOIRES FICTIVES, écrites pour la démonstration.
 * Pour de vrais témoignages : accord écrit de la femme, choix du prénom (réel, d'emprunt ou anonymat)
 * et possibilité de retrait à tout moment (voir le document 05).
 */
export const STORIES: Story[] = [
  {
    id: "espoir",
    firstName: "Aïcha",
    theme: "Comment j'ai gardé espoir",
    readingMinutes: 2,
    paragraphs: [
      "Quand on m'a annoncé la maladie, j'ai eu l'impression que le sol disparaissait. Pendant quelques jours, je n'ai parlé à personne.",
      "Un soir, j'ai fini par appeler ma sœur. Je n'avais pas de grands mots, juste « j'ai besoin de toi ». Elle est venue, elle s'est assise près de moi et elle m'a simplement écoutée. Ce soir-là, je me suis sentie moins seule.",
      "Je ne vous dirai pas que tout a été facile. Il y a eu des jours de fatigue, des jours de peur. Mais j'ai appris à avancer par petites étapes : un rendez-vous après l'autre, un jour après l'autre. Et à demander de l'aide, sans honte.",
    ],
  },
  {
    id: "corps",
    firstName: "Fatim",
    theme: "Comment j'ai accepté mon corps",
    readingMinutes: 2,
    paragraphs: [
      "Après l'opération, je ne voulais plus me regarder dans le miroir. Je me sentais étrangère dans mon propre corps.",
      "Ce qui m'a aidée, ce sont d'autres femmes. Dans un groupe de parole, j'ai entendu quelqu'un dire exactement ce que je n'osais pas dire. J'ai pleuré, et pour la première fois depuis longtemps, je n'étais plus seule avec ça.",
      "Petit à petit, j'ai recommencé à prendre soin de moi : une belle tenue, un foulard que j'aimais, quelques minutes à me regarder avec douceur. Mon corps a traversé une épreuve. Il continue de me porter, et je lui dois de la tendresse.",
    ],
  },
  {
    id: "travail",
    firstName: "Salamata",
    theme: "Mon retour au travail",
    readingMinutes: 2,
    paragraphs: [
      "J'avais peur du regard des autres en reprenant mon travail. Peur des questions, peur de la pitié, peur de ne plus y arriver.",
      "J'ai commencé doucement, quelques heures par jour, après en avoir parlé avec mon équipe soignante. J'ai choisi une collègue de confiance à qui tout dire, et elle a su expliquer aux autres ce que je souhaitais.",
      "Certains jours sont plus lourds que d'autres, et c'est normal. J'ai retrouvé ma place peu à peu, et surtout le sentiment d'être utile. Si vous hésitez, sachez que vous avez le droit d'y aller à votre rythme.",
    ],
  },
];