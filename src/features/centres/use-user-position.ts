import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import type { Coords } from "@/lib/geo";

type PositionState = {
  status: "loading" | "granted" | "denied" | "error";
  coords: Coords | null;
};

/** La position reste sur le téléphone : elle n'est ni enregistrée ni envoyée. */
export function useUserPosition() {
  const [state, setState] = useState<PositionState>({ status: "loading", coords: null });

  const locate = useCallback(async () => {
    setState({ status: "loading", coords: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState({ status: "denied", coords: null });
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        status: "granted",
        coords: { lat: position.coords.latitude, lng: position.coords.longitude },
      });
    } catch {
      setState({ status: "error", coords: null });
    }
  }, []);

  useEffect(() => {
    void locate();
  }, [locate]);

  return { ...state, locate };
}