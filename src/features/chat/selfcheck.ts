import { getReply } from "./engine";
import { INTENTS, START_SUGGESTIONS } from "./knowledge";
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
  ["Quelle est la capitale de la France ?", "(repli)"],
  ["", "(repli)"],
];

/** Vérifie la base de connaissances. Retourne la liste des problèmes (vide si tout est bon). */
export function selfCheck(): string[] {
  const problems: string[] = [];

  const ids = new Set<string>();
  for (const intent of INTENTS) {
    if (ids.has(intent.id)) problems.push(`Identifiant en double : ${intent.id}`);
    ids.add(intent.id);
    if (intent.keywords.length === 0) problems.push(`${intent.id} : aucun mot-clé`);
    for (const keyword of intent.keywords) {
      if (!normalize(keyword.replace(/\*$/, ""))) problems.push(`${intent.id} : mot-clé vide`);
    }
    if (intent.reply.length > 650) problems.push(`${intent.id} : réponse longue (${intent.reply.length} caractères)`);
  }

  const labels = new Set<string>(START_SUGGESTIONS);
  for (const intent of INTENTS) intent.followUps?.forEach((label) => labels.add(label));
  for (const label of labels) {
    if (getReply(label).isFallback) problems.push(`Suggestion non comprise : « ${label} »`);
  }

  for (const [message, expected] of TEST_CASES) {
    const reply = getReply(message);
    const got = reply.intentId ?? "(repli)";
    if (got !== expected) problems.push(`« ${message} » : attendu ${expected}, obtenu ${got}`);
  }

  return problems;
}
