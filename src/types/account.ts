export type ProfileKind = "prevention" | "support";
export type Language = "fr" | "moore" | "dioula" | "fulfulde";
export type AgeRange = "u25" | "25-34" | "35-44" | "45-54" | "55p" | "private";
export type ScreeningStatus = "never" | "recent" | "old" | "unknown";
export type FamilyHistory = "yes" | "no" | "unknown";
export type Stage = "0" | "I" | "II" | "III" | "IV" | "unknown" | "private";

export type Account = {
  firstName: string;
  lastName?: string;
  identifier: string;
  profile: ProfileKind;
  ageRange?: AgeRange;
  city?: string;
  language: Language;
  screening?: ScreeningStatus;
  familyHistory?: FamilyHistory;
  stage?: Stage;
  createdAt: string;
};

export type Option<T extends string> = { value: T; label: string };

export const labelOf = <T extends string>(options: readonly Option<T>[], value?: T) =>
  options.find((option) => option.value === value)?.label;

export const PROFILE_OPTIONS: Option<ProfileKind>[] = [
  { value: "prevention", label: "Prévention" },
  { value: "support", label: "Accompagnement" },
];

export const AGE_OPTIONS: Option<AgeRange>[] = [
  { value: "u25", label: "Moins de 25 ans" },
  { value: "25-34", label: "25 à 34 ans" },
  { value: "35-44", label: "35 à 44 ans" },
  { value: "45-54", label: "45 à 54 ans" },
  { value: "55p", label: "55 ans et plus" },
  { value: "private", label: "Je préfère ne pas dire" },
];

export const LANGUAGE_OPTIONS: Option<Language>[] = [
  { value: "fr", label: "Français" },
  { value: "moore", label: "Mooré" },
  { value: "dioula", label: "Dioula" },
  { value: "fulfulde", label: "Fulfuldé" },
];

export const SCREENING_OPTIONS: Option<ScreeningStatus>[] = [
  { value: "never", label: "Jamais" },
  { value: "recent", label: "Il y a moins d'un an" },
  { value: "old", label: "Il y a plus d'un an" },
  { value: "unknown", label: "Je ne sais pas" },
];

export const FAMILY_OPTIONS: Option<FamilyHistory>[] = [
  { value: "yes", label: "Oui" },
  { value: "no", label: "Non" },
  { value: "unknown", label: "Je ne sais pas" },
];

export const STAGE_OPTIONS: Option<Stage>[] = [
  { value: "0", label: "Stade 0" },
  { value: "I", label: "Stade I" },
  { value: "II", label: "Stade II" },
  { value: "III", label: "Stade III" },
  { value: "IV", label: "Stade IV" },
  { value: "unknown", label: "Je ne sais pas" },
  { value: "private", label: "Je préfère ne pas dire" },
];