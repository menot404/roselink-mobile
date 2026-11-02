import type { SourceId } from "@/features/chat/knowledge/types";

export type Association = {
  id: string;
  name: string;
  tagline: string;
  services: string[];
  /** null : coordonnées à confirmer */
  phone: string | null;
  /** false tant que l'association n'a pas confirmé ses informations */
  verified: boolean;
  note?: string;
  sources: SourceId[];
};