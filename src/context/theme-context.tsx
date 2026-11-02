import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { palette, type Scheme } from "@/theme/colors";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "roselink.theme";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  /** Thème réellement appliqué */
  scheme: Scheme;
  /** Thème détecté sur le téléphone */
  systemScheme: Scheme;
  colors: (typeof palette)[Scheme];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  const systemScheme: Scheme = system === "dark" ? "dark" : "light";
  const scheme: Scheme = preference === "system" ? systemScheme : preference;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setPreferenceState(saved);
        }
      })
      .catch(() => {});
  }, []);

  // NativeWind reçoit toujours « light » ou « dark », jamais « system »
  useEffect(() => {
    setColorScheme(scheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme]);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  };

  const value = useMemo(
    () => ({ preference, setPreference, scheme, systemScheme, colors: palette[scheme] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preference, scheme, systemScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme doit être utilisé dans AppThemeProvider");
  return context;
}