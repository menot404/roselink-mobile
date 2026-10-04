import type { Intent } from "./types";

/**
 * Informations sur l'offre au Burkina Faso : issues de la presse et de déclarations officielles.
 * Toutes sont marquées « review » : à confirmer auprès du ministère de la Santé ou des centres.
 */
export const BURKINA_INTENTS: Intent[] = [
  {
    id: "gratuite",
    status: "review",
    sources: ["sidwaya", "apidpm", "fasoamazone"],
    keywords: [
      "gratuit*",
      "depistage gratuit",
      "examen gratuit",
      "c est gratuit",
      "est ce gratuit",
      "cout*",
      "prix",
      "payer",
      "tarif*",
      "combien ca coute",
    ],
    reply:
      "Au Burkina Faso, la gratuité du dépistage des cancers du sein et gynécologiques est annoncée dans les formations sanitaires publiques, et l'échographie et la mammographie sont décrites comme gratuites dans les CHU et hôpitaux régionaux qui en disposent. Le dépistage est aussi annoncé gratuit dans les cliniques mobiles. Les règles et la disponibilité peuvent changer : confirmez auprès du centre avant de vous déplacer.",
    actions: [{ label: "Trouver un centre", href: "/carte" }],
    followUps: ["Y a-t-il des cliniques mobiles ?", "Où me faire dépister ?", "Je n'ai pas d'argent"],
  },
  {
    id: "cliniques_mobiles",
    status: "review",
    sources: ["fasoamazone", "sidwaya", "lepays"],
    keywords: [
      "clinique mobile",
      "cliniques mobiles",
      "clinique ambulante",
      "camion de depistage",
      "unite mobile",
      "dans mon village",
      "zone rurale",
      "brousse",
      "village*",
    ],
    reply:
      "Depuis le 25 juillet 2024, des cliniques mobiles sont déployées dans toutes les régions du pays pour dépister les cancers du sein et du col de l'utérus. Elles se rapprochent des populations, y compris en zone rurale. Pour connaître le calendrier près de chez vous, renseignez-vous auprès de votre centre de santé ou de la direction régionale de la santé.",
    actions: [{ label: "Voir la carte", href: "/carte" }],
    followUps: ["C'est gratuit ?", "Où me faire dépister ?"],
  },
  {
    id: "ou_aller",
    status: "review",
    sources: ["afro-bf", "sidwaya"],
    keywords: [
      "ou aller",
      "ou me faire",
      "ou se faire",
      "ou puis je",
      "ou trouver",
      "quel centre",
      "quels centres",
      "centre*",
      "hopital*",
      "csps",
      "cmu",
      "chu",
      "clinique*",
      "formation sanitaire",
      "yalgado",
      "bogodogo",
      "tengandogo",
      "tingandogo",
      "pres de chez moi",
      "a proximite",
      "carte",
    ],
    reply:
      "Vous pouvez commencer par un centre de santé proche de chez vous (CSPS, CMU), qui peut vous examiner et vous orienter. À Ouagadougou, les centres hospitaliers universitaires (Yalgado Ouédraogo, Bogodogo, Tengandogo) disposent de services spécialisés. L'onglet Carte montre les centres les plus proches de vous, avec leur distance.",
    actions: [{ label: "Ouvrir la carte", href: "/carte" }],
    followUps: ["C'est gratuit ?", "Y a-t-il des cliniques mobiles ?", "Comment se passe un examen ?"],
  },
  {
    id: "sans_argent",
    status: "review",
    sources: ["zcf", "sante-bf", "sidwaya"],
    keywords: [
      "pas d argent",
      "pas les moyens",
      "pas assez d argent",
      "trop cher",
      "je suis pauvre",
      "sans moyens",
      "je n ai pas les moyens",
      "difficultes financieres",
    ],
    reply:
      "Le manque de moyens ne doit pas vous empêcher d'être examinée : le dépistage est annoncé gratuit dans les structures publiques (voir « C'est gratuit ? »). Pour les soins et les besoins pratiques, certaines associations peuvent aider, comme Zéro Cancer Féminin ou la Fondation Orange Burkina (campagnes de chirurgie gratuite). Confirmez toujours auprès d'elles.",
    actions: [{ label: "Voir les associations", href: "/association" }],
    followUps: ["C'est gratuit ?", "Parler d'une association"],
  },
  {
    id: "col_uterus",
    status: "review",
    sources: ["fasoamazone", "sidwaya"],
    keywords: [
      "col de l uterus",
      "col uterin",
      "frottis",
      "hpv",
      "papillomavirus",
      "cancer du col",
    ],
    reply:
      "RoseLink se concentre sur le cancer du sein. Au Burkina Faso, les campagnes et les cliniques mobiles dépistent souvent aussi le cancer du col de l'utérus, et le dépistage des lésions précancéreuses du col est annoncé gratuit depuis 2016. Demandez au centre si les deux examens peuvent être faits lors de la même visite.",
    followUps: ["Où me faire dépister ?", "C'est gratuit ?"],
  },
  {
    id: "octobre_rose",
    status: "sourced",
    sources: ["who-bcam", "lepays"],
    keywords: ["octobre rose", "campagne*", "pourquoi rose", "pourquoi octobre", "ruban rose"],
    reply:
      "Octobre Rose est le mois mondial de sensibilisation au cancer du sein, chaque année en octobre. Il rappelle l'importance de connaître les signes, de consulter vite et de se faire dépister. Au Burkina Faso, des campagnes de sensibilisation et de dépistage ont lieu pendant ce mois. Vous pouvez en profiter, mais un examen est utile à n'importe quel moment de l'année.",
    followUps: ["Où me faire dépister ?", "C'est gratuit ?"],
  },
  {
    id: "associations",
    status: "review",
    sources: ["zcf", "sante-bf"],
    keywords: [
      "association*",
      "zero cancer feminin",
      "afac",
      "fondation orange",
      "ong",
      "groupe de parole",
    ],
    reply:
      "Parmi les associations qui accompagnent les femmes au Burkina Faso : Zéro Cancer Féminin (créée en octobre 2020, causeries et dons de prothèses mammaires), l'AFAC, et la Fondation Orange Burkina (campagnes de chirurgie gratuite). L'onglet Association de RoseLink les présente. Les services peuvent changer : contactez-les pour confirmer.",
    actions: [{ label: "Voir les associations", href: "/association" }],
    followUps: ["C'est gratuit ?", "Je n'ai pas d'argent"],
  },
];
