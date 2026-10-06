import type { ChatAction, Intent } from "./types";

export const SUPPORT_START_SUGGESTIONS = [
  "J'ai peur",
  "Je me sens seule",
  "Je suis fatiguée",
  "Effets de la chimio",
  "Comment en parler à mes enfants ?",
];

const MENU = [
  "J'ai peur",
  "Je me sens seule",
  "Effets de la chimio",
  "Que demander à mon médecin ?",
];

const BREATH: ChatAction = {
  label: "Respiration guidée",
  href: "/audio",
  params: { id: "respiration-fr" },
};

const SUPPORT_AUDIO: ChatAction = {
  label: "Écouter un message de soutien",
  href: "/audio",
  params: { id: "soutien-fr" },
};

/** Écoute, émotions et sécurité. Tout est « à valider » par une psychologue ou un psychologue. */
export const SUPPORT_EMOTION_INTENTS: Intent[] = [
  {
    id: "detresse",
    priority: 100,
    status: "review",
    keywords: [
      "suicide",
      "suicid*",
      "me tuer",
      "en finir",
      "mettre fin a mes jours",
      "plus envie de vivre",
      "je ne veux plus vivre",
      "envie de mourir",
      "je veux mourir",
      "disparaitre",
      "ne vaut plus la peine de vivre",
    ],
    reply:
      "Merci de me le dire. Je suis vraiment désolée que vous souffriez autant. Vous n'êtes pas seule, et votre vie compte. Parlez dès maintenant à une personne de confiance ou à un professionnel : [NUMÉRO À INSÉRER]. Si vous pensez à vous faire du mal, rendez-vous aux urgences ou demandez à un proche de vous accompagner. Vous pouvez aussi le dire à votre équipe soignante : elle peut vous aider.",
  },
  {
    id: "arret_traitement",
    status: "review",
    sources: ["chuv", "cusm"],
    keywords: [
      "arreter mon traitement",
      "arreter le traitement",
      "arreter la chimio",
      "arreter les medicaments",
      "arreter mes medicaments",
      "ne plus prendre",
      "je veux arreter",
      "abandonner le traitement",
      "stopper le traitement",
    ],
    reply:
      "Je comprends que cela puisse être très lourd. N'arrêtez et ne modifiez aucun traitement sans en parler d'abord à votre équipe soignante : elle peut souvent soulager ce qui vous pèse et adapter le traitement. Notez ce qui est le plus difficile à supporter, et contactez-la avant votre prochain rendez-vous si c'est trop dur.",
    followUps: ["Effets de la chimio", "Que demander à mon médecin ?", "Je suis fatiguée"],
  },
  {
    id: "urgence_symptomes",
    status: "review",
    sources: ["icm", "cusm"],
    keywords: [
      "fievre",
      "frissons",
      "saignement*",
      "saigne*",
      "bleus",
      "essouffle*",
      "difficulte a respirer",
      "douleur intense",
      "vomissements qui ne s arretent pas",
      "je me sens tres mal",
      "urgence*",
    ],
    reply:
      "Pendant un traitement, certains signes doivent être signalés sans attendre à votre équipe soignante : fièvre ou frissons, saignements ou bleus inhabituels, vomissements qui ne s'arrêtent pas, douleur intense, essoufflement. Appelez votre service ou rendez-vous aux urgences, sans attendre le prochain rendez-vous. Je ne peux pas évaluer votre situation : gardez le numéro de votre service à portée de main.",
    followUps: ["Que demander à mon médecin ?", "Effets de la chimio"],
  },
  {
    id: "salut",
    status: "sourced",
    keywords: ["bonjour", "bonsoir", "salut", "coucou", "hello"],
    reply:
      "Bonjour. Je suis là, sans jugement, quand vous voulez. Vous pouvez me parler de ce que vous ressentez ou me poser vos questions. Comment vous sentez-vous aujourd'hui ?",
    followUps: MENU,
  },
  {
    id: "merci",
    status: "sourced",
    keywords: ["merci*"],
    reply: "Avec plaisir. Prenez soin de vous. Je reste là quand vous voulez.",
    followUps: MENU,
  },
  {
    id: "identite",
    status: "sourced",
    keywords: [
      "qui es tu",
      "qui etes vous",
      "vous etes qui",
      "etes vous un medecin",
      "etes vous une ia",
      "etes vous un robot",
      "vous etes un robot",
      "etes vous humain",
      "qui est roselink",
      "etes vous psychologue",
    ],
    reply:
      "Je suis l'assistante de RoseLink, un programme informatique : je ne suis ni médecin ni psychologue. Dans cette version de démonstration, mes réponses viennent d'une base de connaissances préparée à partir de sources sérieuses, et non d'une intelligence artificielle libre. Je peux vous écouter, vous informer et vous orienter, mais pas remplacer votre équipe soignante.",
    followUps: MENU,
  },
  {
    id: "aide",
    status: "sourced",
    keywords: [
      "que pouvez vous faire",
      "que savez vous",
      "comment ca marche",
      "menu",
      "besoin d aide",
      "vous pouvez m aider",
      "aidez moi",
      "sujets",
    ],
    reply:
      "Je peux vous écouter, et vous aider sur : vos émotions (peur, tristesse, solitude, fatigue), les effets des traitements, l'image de soi, la famille et les enfants, le couple, le travail, l'argent et les aides. Parlez avec vos mots.",
    followUps: MENU,
  },
  {
    id: "peur",
    status: "review",
    actions: [BREATH],
    keywords: [
      "peur*",
      "j ai peur",
      "angoisse*",
      "anxieu*",
      "anxiete",
      "inquiet*",
      "stress*",
      "panique*",
      "terrifie*",
      "j ai la boule au ventre",
    ],
    reply:
      "Ce que vous ressentez est normal, et vous n'êtes pas seule. La peur vient souvent par vagues. Voulez-vous essayer un exercice de respiration de quelques minutes, ou me dire de quoi vous avez le plus peur ?",
    followUps: ["Peur de la rechute", "Je dors mal", "Je me sens seule"],
  },
  {
    id: "peur_rechute",
    status: "review",
    keywords: [
      "rechute*",
      "recidive*",
      "ca va revenir",
      "reviendra",
      "revenir",
      "retomber malade",
      "peur que ca revienne",
    ],
    reply:
      "Cette peur est très fréquente, pendant et après les traitements. Je ne peux pas prédire l'avenir, et personne ne peut vous en donner la garantie. Votre équipe prévoit un suivi régulier justement pour surveiller. Notez vos questions et parlez-en à votre prochain rendez-vous : un psychologue peut aussi vous aider à vivre avec cette inquiétude.",
    followUps: ["Que demander à mon médecin ?", "J'ai peur"],
  },
  {
    id: "peur_mourir",
    status: "review",
    keywords: [
      "j ai peur de mourir",
      "peur de mourir",
      "vais je mourir",
      "vais mourir",
      "vais en mourir",
      "mourir",
    ],
    reply:
      "C'est l'une des questions les plus lourdes, et je comprends qu'elle vous traverse. Je ne peux pas y répondre à votre place : seule votre équipe connaît votre situation. Vous pouvez lui poser la question directement, et je peux vous aider à préparer ce que vous voulez lui dire. Si cette pensée vous écrase, parlez-en aussi à un psychologue ou à une personne de confiance.",
    followUps: ["Que demander à mon médecin ?", "Je me sens seule"],
  },
  {
    id: "tristesse",
    status: "review",
    actions: [SUPPORT_AUDIO],
    keywords: [
      "triste*",
      "tristesse",
      "deprim*",
      "depressi*",
      "pleurer",
      "pleure",
      "larmes",
      "cafard",
      "decourag*",
      "a quoi bon",
      "envie de rien",
      "plus envie",
      "baisse les bras",
      "moral",
    ],
    reply:
      "Ce que vous ressentez est lourd, et ce n'est pas de la faiblesse : la maladie et les traitements fatiguent le corps comme le moral. Pleurer fait partie des réactions normales. Avez-vous une personne de confiance à qui en parler aujourd'hui ? Si cette tristesse dure ou vous pèse beaucoup, dites-le à votre équipe : un psychologue peut vous aider.",
    followUps: ["Je me sens seule", "Un exercice de respiration"],
  },
  {
    id: "colere",
    status: "review",
    keywords: ["colere*", "en colere", "injuste*", "revolte*", "j en veux a", "ras le bol"],
    reply:
      "La colère est une réaction très courante face à la maladie, et vous avez le droit de la ressentir. Il n'y a pas de bonne ou de mauvaise façon de vivre cette épreuve. En parler, à un proche, à une psychologue ou dans un groupe de parole, peut soulager.",
    followUps: ["Je me sens seule", "Parler à une association"],
  },
  {
    id: "culpabilite",
    status: "sourced",
    sources: ["who-bc"],
    keywords: [
      "ma faute",
      "c est de ma faute",
      "coupable",
      "culpabil*",
      "j aurais du",
      "me reproche*",
      "pourquoi moi",
      "punition",
      "malediction*",
      "sorcellerie",
    ],
    reply:
      "Le cancer du sein n'est la faute de personne. Il n'est causé ni par une faute, ni par un mauvais sort, et environ 80 % des femmes touchées n'ont aucun autre facteur de risque que le sexe et l'âge. Vous n'avez rien fait pour le mériter. Si cette pensée revient souvent, en parler à une psychologue peut aider.",
    followUps: ["Je me sens seule", "J'ai peur"],
  },
  {
    id: "solitude",
    status: "review",
    actions: [{ label: "Voir les associations", href: "/association" }, SUPPORT_AUDIO],
    keywords: [
      "seule",
      "isolee",
      "personne ne comprend",
      "personne ne me comprend",
      "abandonnee",
      "solitude",
      "je suis seule",
      "me sens seule",
      "personne ne m ecoute",
    ],
    reply:
      "Je suis désolée que vous vous sentiez seule. Vous ne l'êtes pas : beaucoup de femmes ont vécu ou vivent la même chose. Des associations proposent des visites, des groupes de parole et du soutien moral. Voulez-vous voir lesquelles, ou écouter un message de soutien ?",
    followUps: ["Parler à une association", "J'ai peur"],
  },
  {
    id: "fatigue",
    status: "sourced",
    sources: ["icm", "cusm"],
    keywords: [
      "fatigue*",
      "fatigu*",
      "epuis*",
      "crevee",
      "sans energie",
      "plus la force",
      "je n en peux plus",
      "a bout",
    ],
    reply:
      "La fatigue est un effet très fréquent des traitements et de la maladie. Reposez-vous sans culpabiliser, gardez des activités douces qui vous font du bien et anticipez vos moments de fatigue. Si elle devient soudaine et extrême, ou s'accompagne d'autres signes comme de la fièvre, prévenez votre équipe sans attendre.",
    followUps: ["Je dors mal", "Effets de la chimio", "J'ai peur"],
  },
  {
    id: "sommeil",
    status: "review",
    actions: [BREATH],
    keywords: [
      "dormir",
      "dors mal",
      "sommeil",
      "insomnie*",
      "nuit",
      "nuits",
      "reveil*",
      "cauchemar*",
    ],
    reply:
      "Les nuits peuvent être difficiles quand l'esprit est plein. Un exercice de respiration lente avant de dormir peut aider à se détendre. Si le manque de sommeil dure, parlez-en à votre équipe : elle peut vous proposer des solutions adaptées.",
    followUps: ["J'ai peur", "Je suis fatiguée"],
  },
  {
    id: "relaxation",
    status: "review",
    actions: [BREATH],
    keywords: [
      "respiration*",
      "respirer",
      "relaxation",
      "detente",
      "me calmer",
      "m apaiser",
      "apaiser",
      "meditation",
      "me detendre",
    ],
    reply:
      "Voici un exercice simple : installez-vous confortablement, inspirez doucement par le nez en comptant jusqu'à quatre, puis expirez lentement par la bouche en comptant jusqu'à six. Recommencez quelques fois, à votre rythme. Vous pouvez aussi l'écouter, guidé, dans RoseLink.",
    followUps: ["J'ai peur", "Je dors mal"],
  },
];