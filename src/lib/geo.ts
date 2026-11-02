export type Coords = { lat: number; lng: number };

/** Position par défaut : centre de Ouagadougou */
export const OUAGADOUGOU: Coords = { lat: 12.3714, lng: -1.5197 };

const EARTH_RADIUS_KM = 6371;
const toRad = (degrees: number) => (degrees * Math.PI) / 180;

/** Distance à vol d'oiseau (formule de haversine) */
export function distanceKm(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}