import { Linking } from "react-native";

import type { Center } from "@/types/center";

export function openDirections(center: Center) {
  const hasCoords = center.lat !== null && center.lng !== null;
  const url = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${center.name} ${center.city}`,
      )}`;
  Linking.openURL(url).catch(() => {});
}

export function callCenter(center: Center) {
  if (!center.phone) return;
  Linking.openURL(`tel:${center.phone.replace(/\s/g, "")}`).catch(() => {});
}