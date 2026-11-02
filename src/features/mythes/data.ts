import type { SourceId } from "@/features/chat/knowledge/types";

export type Verdict = "myth" | "fact";

export type Claim = {
  id: string;
  statement: string;
  verdict: Verdict;
  explanation: string;
  sources: SourceId[];
  /** "review" : à faire valider par un professionnel de santé */
  status: "sourced" | "review";
};

/** Contenu à faire valider par un professionnel de santé. */
export const MYTHES_REVIEW: { validated: boolean; reviewer?: string; reviewedAt?: string } = {
  validated: false,
};

export const CLAIMS: Claim[] = [
  {
    id: "boule-cancer",
    statement: "Une boule dans le sein, c'est forcément un cancer.",
    verdict: "myth",
    explanation:
      "La plupart des boules ne sont pas des cancers. Mais toute boule doit être examinée par un professionnel : lui seul peut faire la différence, et plus un cancer est repéré petit, plus il se traite facilement.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "age",
    statement: "Seules les femmes âgées sont concernées.",
    verdict: "myth",
    explanation:
      "Le risque augmente avec l'âge, mais la maladie peut survenir à tout âge après la puberté. L'OMS note que dans les pays à ressources limitées, elle touche souvent des femmes plus jeunes.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "malediction",
    statement: "Le cancer du sein est une malédiction ou le résultat de la sorcellerie.",
    verdict: "myth",
    explanation:
      "C'est une maladie, pas une punition. Elle n'est causée ni par un mauvais sort ni par une faute. Elle peut être dépistée et soignée.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "contagieux",
    statement: "Le cancer du sein est contagieux.",
    verdict: "myth",
    explanation:
      "On ne l'attrape pas au contact d'une personne malade : ni en vivant avec elle, ni en partageant ses affaires. Vous pouvez soutenir une proche sans aucun risque.",
    sources: ["who-bc"],
    status: "review",
  },
  {
    id: "douleur",
    statement: "Si je n'ai pas mal, je n'ai pas à m'inquiéter.",
    verdict: "myth",
    explanation:
      "Une boule cancéreuse est souvent indolore. L'absence de douleur ne doit pas rassurer : un changement du sein doit être examiné même s'il ne fait pas mal.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "tot",
    statement: "Plus le cancer du sein est repéré tôt, plus les traitements ont de chances d'être efficaces.",
    verdict: "fact",
    explanation:
      "C'est la raison d'être du diagnostic précoce : les traitements sont plus efficaces et mieux tolérés quand ils commencent tôt et sont menés jusqu'au bout.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "hommes",
    statement: "Les hommes ne peuvent pas avoir de cancer du sein.",
    verdict: "myth",
    explanation:
      "C'est rare, environ 0,5 à 1 % des cas selon l'OMS, mais cela existe. Un homme qui remarque une boule au sein doit aussi consulter.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "famille",
    statement: "Seules les femmes qui ont des antécédents familiaux sont concernées.",
    verdict: "myth",
    explanation:
      "La plupart des femmes qui ont un cancer du sein n'ont pas d'antécédent familial connu. Environ 80 % des cas surviennent chez des femmes sans autre facteur de risque que le sexe et l'âge : toute femme est concernée.",
    sources: ["who-bc"],
    status: "sourced",
  },
  {
    id: "palper",
    statement: "Se palper les seins peut propager la maladie.",
    verdict: "myth",
    explanation:
      "Se palper ne présente aucun danger. Au contraire, connaître vos seins vous aide à repérer un changement tôt. Palpez avec le plat des doigts, doucement mais fermement.",
    sources: ["afro-bf"],
    status: "review",
  },
  {
    id: "alcool-tabac",
    statement: "L'alcool et le tabac n'ont aucun effet sur le risque de cancer du sein.",
    verdict: "myth",
    explanation:
      "L'OMS cite la consommation nocive d'alcool et le tabac parmi les facteurs qui augmentent le risque, tout comme l'obésité. Aucun geste ne garantit de ne pas être malade, mais certains facteurs peuvent être réduits.",
    sources: ["who-bc"],
    status: "sourced",
  },
];
