export type CenterType = "fixe" | "mobile";

export type Center = {
  id: string;
  name: string;
  type: CenterType;
  city: string;
  /** Liste vide : services à vérifier */
  services: string[];
  /** null : coût à vérifier */
  cost: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  nextMobileClinic: string | null;
  appointmentRequired: boolean | null;
  verified: boolean;
  /** Fiche de démonstration à remplacer par une vraie fiche */
  isExample?: boolean;
  source: string;
};