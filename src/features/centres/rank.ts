import { distanceKm, type Coords } from "@/lib/geo";
import type { Center } from "@/types/center";

export type RankedCenter = { center: Center; distanceKm: number | null };

/** Trie du plus proche au plus loin. Les centres sans coordonnées passent en dernier. */
export function rankCenters(centers: Center[], origin: Coords): RankedCenter[] {
  return centers
    .map((center) => ({
      center,
      distanceKm:
        center.lat !== null && center.lng !== null
          ? distanceKm(origin, { lat: center.lat, lng: center.lng })
          : null,
    }))
    .sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) {
        return a.center.name.localeCompare(b.center.name, "fr");
      }
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}