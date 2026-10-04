import type { AudioTrack } from "@/types/audio";

const DEMO_EXPERT = { name: "Voix de démonstration", role: "Enregistrement à venir" };

/**
 * Bibliothèque audio. Pour ajouter un vrai enregistrement :
 * 1. déposer le fichier dans assets/audio/ (ex. signes_moore_v1.mp3)
 * 2. copier une entrée ci-dessous : language, source, expert, validatedAt
 * 3. mettre demo à false SEULEMENT après relecture par un professionnel et consentement signé
 */
export const ALL_TRACKS: AudioTrack[] = [
  {
    id: "signes-fr",
    title: "Les signes à connaître",
    theme: "signes",
    module: "prevention",
    language: "fr",
    durationSec: 14,
    source: require("../../assets/audio/signes_fr_demo.wav"),
    transcript:
      "Connaître ses seins, c'est la meilleure façon de repérer vite un changement. Voici ce qui doit vous alerter : une boule ou une grosseur dans le sein ou sous l'aisselle, un sein qui change de forme, une peau qui ressemble à une peau d'orange, une rougeur, un mamelon qui rentre, ou un liquide qui sort du mamelon. Un de ces signes ne veut pas dire que vous avez un cancer. Mais il faut le faire examiner. N'attendez pas, et ne restez pas seule avec votre peur. Allez dans un centre de santé.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
  {
    id: "geste-fr",
    title: "Le geste mensuel, pas à pas",
    theme: "geste",
    module: "prevention",
    language: "fr",
    durationSec: 16,
    source: require("../../assets/audio/geste_fr_demo.wav"),
    transcript:
      "Une fois par mois, quelques jours après la fin de vos règles, prenez cinq minutes pour vous. D'abord, regardez-vous dans un miroir, bras le long du corps, puis bras levés. Observez la forme et la peau. Ensuite, avec trois doigts à plat, faites de petits cercles sur tout le sein, jusqu'à l'aisselle. Faites-le debout, sous la douche, puis allongée. Si vous sentez ou voyez quelque chose de nouveau, ne paniquez pas : allez consulter. Ce geste ne remplace pas le dépistage par un professionnel, mais il vous aide à mieux vous connaître.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
  {
    id: "depistage-fr",
    title: "Pourquoi se faire dépister",
    theme: "depistage",
    module: "prevention",
    language: "fr",
    durationSec: 10,
    source: require("../../assets/audio/depistage_fr_demo.wav"),
    transcript:
      "Se faire dépister, c'est un moment court, avec des professionnels. Le but est de repérer un problème tôt, quand il est plus facile à traiter. Vous pouvez y aller même si vous n'avez aucun signe, et vous pouvez venir accompagnée. Ouvrez RoseLink pour trouver le centre le plus proche.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
  {
    id: "mythes-fr",
    title: "Mythes ou réalités",
    theme: "mythes",
    module: "prevention",
    language: "fr",
    durationSec: 10,
    source: require("../../assets/audio/mythes_fr_demo.wav"),
    transcript:
      "Non, le cancer du sein n'est pas une malédiction. Non, il n'est pas contagieux. C'est une maladie, et plus elle est repérée tôt, plus les traitements ont de chances d'être efficaces. Alors parlez-en autour de vous, et allez vous faire examiner.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
  {
    id: "soutien-fr",
    title: "Un message de soutien",
    theme: "soutien",
    module: "support",
    language: "fr",
    durationSec: 12,
    source: require("../../assets/audio/soutien_fr_demo.wav"),
    transcript:
      "Si vous vivez avec la maladie, je veux vous dire d'abord : vous n'êtes pas seule. Ce que vous ressentez, la peur, la colère, la fatigue, la tristesse, est normal. Vous n'avez pas à tout porter seule. Parlez à une personne de confiance, à votre équipe soignante, ou à une association. Prenez les choses un jour à la fois. Et si un jour c'est trop lourd, dites-le. Demander de l'aide, c'est une force.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
  {
    id: "respiration-fr",
    title: "Respiration guidée",
    theme: "respiration",
    module: "support",
    language: "fr",
    durationSec: 24,
    source: require("../../assets/audio/respiration_fr_demo.wav"),
    transcript:
      "Installez-vous confortablement. Posez une main sur votre ventre. Inspirez doucement par le nez, en comptant jusqu'à quatre. Gardez l'air un instant. Expirez lentement par la bouche, en comptant jusqu'à six. Encore une fois. Inspirez, et expirez. À chaque souffle, laissez vos épaules descendre. Encore deux fois, à votre rythme. Quand vous êtes prête, ouvrez les yeux. Vous pouvez refaire cet exercice quand l'inquiétude monte.",
    expert: DEMO_EXPERT,
    status: "validated",
    consentSigned: true,
    demo: true,
  },
];

/** Seuls les audios validés ET avec consentement signé sont visibles dans l'application. */
export const PUBLISHED_TRACKS = ALL_TRACKS.filter(
  (track) => track.status === "validated" && track.consentSigned,
);