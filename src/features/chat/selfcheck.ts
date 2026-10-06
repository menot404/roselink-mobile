import { getReply } from "./engine";
import {
  PREVENTION_INTENTS,
  START_SUGGESTIONS,
  SUPPORT_INTENTS,
  SUPPORT_START_SUGGESTIONS,
} from "./knowledge";
import type { ChatMode, Intent } from "./knowledge/types";
import { normalize } from "./normalize";

/** Cas de test de référence : [message, intention attendue]. À enrichir lors des relectures. */
export const TEST_CASES: [string, string][] = [
  ["Quels sont les signes ?", "signes_generaux"],
  ["Quels sont les symptômes du cancer du sein", "signes_generaux"],
  ["J'ai senti une boule dans le sein", "boule"],
  ["j'ai une grosseur sous l'aisselle", "aisselle"],
  ["Mon sein me fait mal", "douleur"],
  ["J'ai un écoulement au mamelon", "mamelon"],
  ["ma peau est rouge avec des fossettes", "peau"],
  ["J'ai une plaie qui ne guérit pas", "plaie"],
  ["Comment me palper ?", "auto_examen"],
  ["Quand le faire ?", "quand_auto_examen"],
  ["Où me faire dépister ?", "ou_aller"],
  ["Quel centre près de chez moi ?", "ou_aller"],
  ["C'est gratuit ?", "gratuite"],
  ["Combien ça coûte ?", "gratuite"],
  ["Y a-t-il des cliniques mobiles ?", "cliniques_mobiles"],
  ["Je n'ai pas d'argent", "sans_argent"],
  ["À partir de quel âge ?", "age_depistage"],
  ["Qu'est-ce que le dépistage ?", "depistage_def"],
  ["Mammographie ou échographie ?", "mammo_vs_echo"],
  ["C'est quoi une mammographie ?", "mammographie"],
  ["C'est quoi une échographie ?", "echographie"],
  ["C'est quoi une biopsie ?", "biopsie"],
  ["Est-ce douloureux ?", "douleur_examen"],
  ["Ça fait mal la mammographie ?", "douleur_examen"],
  ["Comment se passe un examen ?", "deroulement"],
  ["Que dois-je apporter ?", "preparer"],
  ["Est-ce que j'ai un cancer ?", "diagnostic"],
  ["Quel médicament prendre ?", "medicament"],
  ["Je n'ai plus envie de vivre", "detresse"],
  ["je veux mourir", "detresse"],
  ["C'est une malédiction ?", "mythe_malediction"],
  ["Est-ce contagieux ?", "contagieux"],
  ["Les hommes peuvent en avoir ?", "hommes"],
  ["Est-ce héréditaire ?", "famille"],
  ["Ma mère a eu un cancer du sein", "famille"],
  ["Quels sont les risques ?", "risques"],
  ["Comment réduire le risque ?", "reduire"],
  ["Est-ce que c'est un kyste ?", "benin"],
  ["Comment se soigne-t-il ?", "traitement"],
  ["Est-ce qu'on en guérit ?", "guerison"],
  ["Parler d'une association", "associations"],
  ["J'ai peur", "peur"],
  ["Que faire si j'ai peur ?", "peur"],
  ["Bonjour", "salut"],
  ["Merci beaucoup", "merci"],
  ["Qui êtes-vous ?", "identite"],
  ["Je suis enceinte", "grossesse_allaitement"],
  ["Pourquoi octobre rose ?", "octobre_rose"],
  ["Je suis jeune, 25 ans", "jeune"],
  ["Je n'ai pas de boule, c'est bon ?", "pas_de_boule"],
  ["Le deodorant donne le cancer ?", "mythe_objets"],
  ["mamographie c'est quoi", "mammographie"],
  ["Est-ce que je dois m'inquiéter pour une boule indolore ?", "boule"],
  ["C'est quoi le MammaTyper ?", "mammatyper"],
  ["Parlez-moi du diagnostic moléculaire", "mammatyper"],
  ["Octobre est gratuit ?", "gratuite"],
  ["Est-ce gratuit en octobre rose ?", "gratuite"],
  ["Je veux jouer au quiz", "quiz"],
  ["Y a-t-il des idées reçues ?", "quiz"],
  ["Quelle est la capitale de la France ?", "(repli)"],
  ["", "(repli)"],
];



export const SUPPORT_TEST_CASES: [string, string][] = [
  ["J'ai peur", "peur"],
  ["J'ai peur que ça revienne", "peur_rechute"],
  ["Est-ce que le cancer va revenir ?", "peur_rechute"],
  ["J'ai peur de mourir", "peur_mourir"],
  ["Vais-je mourir ?", "peur_mourir"],
  ["Je suis triste", "tristesse"],
  ["Je n'ai plus envie de rien", "tristesse"],
  ["Je suis en colère", "colere"],
  ["C'est de ma faute", "culpabilite"],
  ["Pourquoi moi ?", "culpabilite"],
  ["Je me sens seule", "solitude"],
  ["Personne ne me comprend", "solitude"],
  ["Je suis fatiguée", "fatigue"],
  ["Je n'en peux plus", "fatigue"],
  ["Je dors mal", "sommeil"],
  ["Un exercice de respiration", "relaxation"],
  ["Je veux mourir", "detresse"],
  ["Je n'ai plus envie de vivre", "detresse"],
  ["Je veux arrêter mon traitement", "arret_traitement"],
  ["J'ai de la fièvre", "urgence_symptomes"],
  ["Fièvre pendant le traitement", "urgence_symptomes"],
  ["Effets de la chimio", "chimio"],
  ["Quels sont les effets secondaires ?", "chimio"],
  ["J'ai des nausées", "nausees"],
  ["Je perds mes cheveux", "cheveux"],
  ["Perte de cheveux", "cheveux"],
  ["Où trouver une perruque ?", "cheveux"],
  ["La radiothérapie fait-elle mal ?", "radiotherapie"],
  ["Je dois me faire opérer", "chirurgie"],
  ["J'ai mal", "douleur"],
  ["Puis-je prendre des tisanes ?", "plantes"],
  ["C'est quoi le MammaTyper ?", "mammatyper"],
  ["Je ne comprends pas mon compte rendu", "comprendre"],
  ["Que demander à mon médecin ?", "preparer_rdv"],
  ["Je ne me sens plus femme", "image_de_soi"],
  ["Je n'ose plus me regarder dans le miroir", "image_de_soi"],
  ["Prothèse ou reconstruction", "prothese_reconstruction"],
  ["Comment en parler à mes enfants ?", "enfants"],
  ["Comment en parler à ma famille ?", "famille"],
  ["Les gens sont maladroits", "entourage_maladroit"],
  ["Mon mari ne me regarde plus pareil", "couple"],
  ["Quand puis-je reprendre le travail ?", "travail"],
  ["Quelles aides existent ?", "argent"],
  ["Je n'ai pas les moyens", "argent"],
  ["Parler à une association", "associations"],
  ["Y a-t-il des groupes de parole ?", "associations"],
  ["Je n'ai plus d'espoir", "espoir"],
  ["Bonjour", "salut"],
  ["Merci", "merci"],
  ["Qui êtes-vous ?", "identite"],
  ["Je suis dépressive", "tristesse"],
  ["Je suis tres fatiguee", "fatigue"],
  ["chimiotherapi c'est dur", "chimio"],
  ["Quelle est la capitale de la France ?", "(repli)"],
];

/** Vérifie une base de connaissances. Retourne la liste des problèmes (vide si tout est bon). */
function checkBank(
  mode: ChatMode,
  intents: Intent[],
  suggestions: string[],
  cases: [string, string][],
): string[] {
  const problems: string[] = [];
  const tag = mode === "support" ? "[accompagnement]" : "[prévention]";

  const ids = new Set<string>();
  for (const intent of intents) {
    if (ids.has(intent.id)) problems.push(`${tag} Identifiant en double : ${intent.id}`);
    ids.add(intent.id);
    if (intent.keywords.length === 0) problems.push(`${tag} ${intent.id} : aucun mot-clé`);
    for (const keyword of intent.keywords) {
      if (!normalize(keyword.replace(/\*$/, ""))) problems.push(`${tag} ${intent.id} : mot-clé vide`);
    }
    if (intent.reply.length > 700) {
      problems.push(`${tag} ${intent.id} : réponse longue (${intent.reply.length} caractères)`);
    }
  }

  const labels = new Set<string>(suggestions);
  for (const intent of intents) intent.followUps?.forEach((label) => labels.add(label));
  for (const label of labels) {
    if (getReply(label, null, mode).isFallback) {
      problems.push(`${tag} Suggestion non comprise : « ${label} »`);
    }
  }

  for (const [message, expected] of cases) {
    const got = getReply(message, null, mode).intentId ?? "(repli)";
    if (got !== expected) problems.push(`${tag} « ${message} » : attendu ${expected}, obtenu ${got}`);
  }

  return problems;
}

/** Vérifie les deux bases (prévention et accompagnement). */
export function selfCheck(): string[] {
  return [
    ...checkBank("prevention", PREVENTION_INTENTS, START_SUGGESTIONS, TEST_CASES),
    ...checkBank("support", SUPPORT_INTENTS, SUPPORT_START_SUGGESTIONS, SUPPORT_TEST_CASES),
  ];
}