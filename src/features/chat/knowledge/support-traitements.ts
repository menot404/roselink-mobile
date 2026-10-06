import type { Intent } from "./types";

/** Traitements et effets. Les informations médicales viennent de guides d'hôpitaux et de centres de lutte contre le cancer. */
export const SUPPORT_TRAITEMENT_INTENTS: Intent[] = [
  {
    id: "chimio",
    status: "sourced",
    sources: ["gustave-roussy", "cusm", "chuv"],
    keywords: [
      "chimio*",
      "chimiotherapie*",
      "effets secondaires",
      "effet secondaire",
      "cure*",
      "perfusion*",
      "traitement*",
    ],
    reply:
      "La chimiothérapie détruit les cellules qui se multiplient vite, ce qui explique des effets sur les cheveux, la bouche ou le sang. Chacune la vit différemment, et l'absence d'effets ne veut pas dire que le traitement est moins efficace. Notez ce que vous ressentez (quand, combien de temps) et parlez-en à l'équipe : elle peut souvent soulager. N'arrêtez rien seule.",
    followUps: ["J'ai des nausées", "Perte de cheveux", "Je suis fatiguée", "Fièvre pendant le traitement"],
  },
  {
    id: "nausees",
    status: "review",
    sources: ["chuv", "icm"],
    keywords: [
      "nausee*",
      "vomi*",
      "vomissement*",
      "mal au coeur",
      "appetit",
      "manger",
      "alimentation",
      "plus de gout",
    ],
    reply:
      "Les nausées peuvent souvent être prévenues ou soulagées par des médicaments : dites-le à votre équipe, ne les supportez pas en silence. Mangez en petites quantités, plus souvent, buvez régulièrement et choisissez ce qui vous fait envie. Si vous ne pouvez plus rien garder, prévenez-la rapidement.",
    followUps: ["Effets de la chimio", "Je suis fatiguée"],
  },
  {
    id: "cheveux",
    status: "sourced",
    sources: ["chuv", "icm", "gustave-roussy"],
    keywords: [
      "perruque*",
      "foulard*",
      "cheveux",
      "chute de cheveux",
      "perdre mes cheveux",
      "chauve",
      "calvitie",
      "cils",
      "sourcils",
    ],
    reply:
      "La perte de cheveux est fréquente avec certaines chimiothérapies, mais pas systématique. Les cheveux repoussent généralement après la fin du traitement, parfois avec une texture ou une couleur un peu différentes. Perruque, foulard ou rien : il n'y a pas de bonne façon. Raccourcir la coupe dès le début peut aider à mieux vivre le moment.",
    followUps: ["Je ne me sens plus femme", "Effets de la chimio"],
  },
  {
    id: "radiotherapie",
    status: "review",
    sources: ["sidwaya", "afro-bf"],
    keywords: ["radiotherapie*", "radio", "rayons", "irradiation", "cobalt", "bruler la peau"],
    reply:
      "La radiothérapie utilise des rayons pour détruire les cellules cancéreuses restantes ; elle se fait en plusieurs séances courtes. La peau de la zone traitée peut rougir ou devenir sensible : signalez à l'équipe toute brûlure, douleur ou rougeur. Au Burkina Faso, la gratuité de la radiothérapie est annoncée pour certaines catégories de patients depuis 2023 : confirmez ce qui s'applique à vous auprès du service.",
    followUps: ["Quelles aides existent ?", "Que demander à mon médecin ?"],
  },
  {
    id: "chirurgie",
    status: "review",
    keywords: [
      "operation*",
      "operee",
      "operer",
      "chirurgie*",
      "anesthesie",
      "drain*",
      "apres l operation",
      "cicatrisation",
      "bras gonfle",
      "gonflement du bras",
    ],
    reply:
      "Après une opération du sein, la fatigue, la douleur et des émotions fortes sont fréquentes. Suivez les consignes de l'équipe pour les soins et le repos, et signalez une fièvre, une rougeur qui s'étend, un écoulement inhabituel ou un gonflement important. Un gonflement du bras du côté opéré mérite aussi d'être montré à l'équipe.",
    followUps: ["Je ne me sens plus femme", "Prothèse ou reconstruction"],
  },
  {
    id: "douleur",
    status: "review",
    keywords: ["douleur*", "j ai mal", "souffre*", "mal partout", "douloureux", "douloureuse"],
    reply:
      "Une douleur doit toujours être signalée : l'équipe peut très souvent la soulager. Ne la supportez pas en silence et ne prenez pas de médicament de votre propre initiative. Pour la décrire, notez où elle est, quand elle survient et son intensité sur une échelle de 0 à 10.",
    followUps: ["Fièvre pendant le traitement", "Que demander à mon médecin ?"],
  },
  {
    id: "plantes",
    status: "review",
    sources: ["chuv", "cusm"],
    keywords: [
      "tisane*",
      "plante*",
      "remede*",
      "traditionnel*",
      "guerisseur*",
      "vitamine*",
      "complement*",
      "produit naturel",
    ],
    reply:
      "Beaucoup de personnes se tournent vers les tisanes, les plantes ou les remèdes traditionnels. Parlez-en à votre équipe soignante avant d'en prendre : certaines substances peuvent modifier l'effet du traitement ou ses effets secondaires. Vous n'avez pas à choisir entre le soutien de vos proches et votre traitement.",
    followUps: ["Effets de la chimio", "Que demander à mon médecin ?"],
  },
  {
    id: "mammatyper",
    status: "review",
    sources: ["burkina24-mt", "minute-mt"],
    keywords: [
      "mammatyper",
      "mammtyper",
      "mamatyper",
      "diagnostic moleculaire",
      "test moleculaire",
      "sous type moleculaire",
      "sous types moleculaires",
    ],
    reply:
      "Si votre médecin vous parle de MammaTyper : c'est un test moléculaire du cancer du sein, rendu disponible au Burkina Faso dans les CHU de Bogodogo et de Pala. Il précise le sous-type de votre cancer afin d'adapter le traitement. Vous pouvez demander à votre médecin ce que le résultat signifie pour vous, avec des mots simples.",
    followUps: ["Que demander à mon médecin ?", "Effets de la chimio"],
  },
  {
    id: "comprendre",
    status: "review",
    keywords: [
      "stade*",
      "grade",
      "type de cancer",
      "comprends pas",
      "pas compris",
      "compte rendu",
      "resultats d analyse",
      "anapath*",
      "recepteur*",
      "mots medicaux",
      "vocabulaire",
    ],
    reply:
      "Les termes médicaux sont difficiles, et il est normal de ne pas tout comprendre. Vous pouvez demander à l'équipe d'expliquer avec des mots simples, et même d'écrire l'essentiel. Le stade décrit l'étendue de la maladie, et des analyses précisent son type pour choisir le traitement. Je ne peux pas interpréter vos résultats : seul votre médecin le peut.",
    followUps: ["Que demander à mon médecin ?", "J'ai peur"],
  },
  {
    id: "preparer_rdv",
    status: "review",
    keywords: [
      "preparer mon rendez vous",
      "preparer ma consultation",
      "questions a poser",
      "que demander",
      "questions pour le medecin",
      "questions pour mon medecin",
      "que dire au medecin",
    ],
    reply:
      "Quelques questions utiles à poser à votre équipe : quel est mon type de cancer et son stade ? quel traitement, et pourquoi ? quels effets secondaires dois-je signaler ? qui appeler en cas de problème ? combien de temps durera le traitement ? quelles aides existent ? Prenez un carnet et venez accompagnée si possible.",
    followUps: ["Fièvre pendant le traitement", "Quelles aides existent ?"],
  },
];