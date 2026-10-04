import type { Intent } from "./types";

export const START_SUGGESTIONS = [
  "Quels sont les signes ?",
  "Où me faire dépister ?",
  "C'est gratuit ?",
  "Comment me palper ?",
  "J'ai peur",
];

const MENU = [
  "Quels sont les signes ?",
  "Comment me palper ?",
  "Où me faire dépister ?",
  "C'est gratuit ?",
];

export const SYSTEM_INTENTS: Intent[] = [
  {
    id: "detresse",
    priority: 100,
    status: "review",
    keywords: [
      "suicide",
      "suicid*",
      "me tuer",
      "en finir avec la vie",
      "mettre fin a mes jours",
      "plus envie de vivre",
      "je ne veux plus vivre",
      "envie de mourir",
      "je veux mourir",
    ],
    reply:
      "Merci de me le dire, et je suis désolée que vous traversiez cela. Ce que vous ressentez compte beaucoup, et vous n'êtes pas seule. Parlez dès maintenant à une personne de confiance ou à un professionnel. Numéro d'aide : [NUMÉRO À INSÉRER]. Si vous êtes en danger, rendez-vous aux urgences les plus proches ou demandez à un proche de venir vous rejoindre.",
  },
  {
    id: "diagnostic",
    status: "sourced",
    sources: ["who-bc"],
    keywords: [
      "ai je un cancer",
      "est ce un cancer",
      "est ce que j ai un cancer",
      "est ce que c est un cancer",
      "c est un cancer",
      "avoir un cancer",
      "j ai un cancer",
      "je pense avoir un cancer",
    ],
    reply:
      "Je comprends que cette question fasse peur. Je ne peux pas poser de diagnostic : seul un professionnel de santé, après un examen, peut vous répondre. Le meilleur premier pas est de vous faire examiner, et plus tôt c'est fait, mieux c'est. Si vous avez déjà reçu un diagnostic, l'espace Accompagnement de RoseLink est fait pour vous.",
    actions: [{ label: "Trouver un centre", href: "/carte" }],
    followUps: ["Où me faire dépister ?", "C'est gratuit ?", "Comment se passe un examen ?"],
  },
  {
    id: "medicament",
    status: "sourced",
    sources: ["who-bc"],
    keywords: [
      "medicament*",
      "que prendre",
      "quel traitement prendre",
      "tisane*",
      "plante*",
      "remede*",
      "pommade",
      "automedication",
    ],
    reply:
      "Je ne peux conseiller ni médicament, ni plante, ni traitement : seul un professionnel de santé peut le faire après un examen. Pour une boule ou un changement du sein, la bonne première étape est de vous faire examiner.",
    actions: [{ label: "Trouver un centre", href: "/carte" }],
    followUps: ["Où me faire dépister ?", "J'ai senti une boule"],
  },
  {
    id: "salut",
    status: "sourced",
    keywords: ["bonjour", "bonsoir", "salut", "coucou", "hello", "bonne journee"],
    reply:
      "Bonjour, je suis l'assistante RoseLink. Je réponds à vos questions sur le sein et le dépistage, sans jugement. Je ne remplace pas un professionnel de santé. Que souhaitez-vous savoir ?",
    followUps: MENU,
  },
  {
    id: "merci",
    status: "sourced",
    keywords: ["merci*"],
    reply: "Avec plaisir. Prenez soin de vous. Je suis là si vous avez d'autres questions.",
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
      "es tu un medecin",
      "etes vous une ia",
      "etes vous un robot",
      "vous etes un robot",
      "vous etes humain",
      "qui est roselink",
      "c est quoi roselink",
      "comment vous appelez vous",
    ],
    reply:
      "Je suis l'assistante de RoseLink, un programme informatique : je ne suis pas médecin. Dans cette version de démonstration, mes réponses viennent d'une base de connaissances préparée à partir de sources officielles, et non d'une intelligence artificielle libre. Je peux vous informer et vous orienter, mais pas poser de diagnostic.",
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
      "de quoi pouvez vous parler",
      "sujets",
    ],
    reply:
      "Je peux vous aider sur : les signes à surveiller, la façon de vous palper, le dépistage (examens, âge, déroulement), où aller et la gratuité au Burkina Faso, les risques, et les idées reçues. Posez votre question avec vos propres mots.",
    followUps: MENU,
  },
];
