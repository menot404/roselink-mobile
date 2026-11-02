import type { Association } from "@/types/association";

/**
 * INFORMATIONS À CONFIRMER auprès de chaque association avant toute utilisation réelle.
 * Pour ajouter un contact : renseigner phone, puis passer verified à true après confirmation.
 */
export const ASSOCIATIONS: Association[] = [
  {
    id: "zcf",
    name: "Zéro Cancer Féminin",
    tagline: "Association créée en octobre 2020 pour soutenir les femmes touchées par un cancer.",
    services: ["Prothèses mammaires", "Soutiens-gorges adaptés", "Causeries de sensibilisation"],
    phone: null,
    verified: false,
    note: "Une contribution symbolique est citée pour les prothèses : à confirmer auprès de l'association.",
    sources: ["zcf"],
  },
  {
    id: "afac",
    name: "AFAC",
    tagline: "Assistance financière et visites de réconfort.",
    services: ["Assistance financière", "Visites de réconfort"],
    phone: null,
    verified: false,
    note: "Cité dans le guide de l'équipe : services à confirmer.",
    sources: [],
  },
  {
    id: "fob",
    name: "Fondation Orange Burkina",
    tagline: "Prise en charge chirurgicale et campagnes de chirurgie gratuite.",
    services: ["Prise en charge chirurgicale", "Chimiothérapie", "Campagnes de chirurgie gratuite"],
    phone: null,
    verified: false,
    note: "Conditions d'accès à confirmer auprès de la fondation.",
    sources: ["sante-bf"],
  },
];