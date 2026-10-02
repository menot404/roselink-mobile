import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { palette, type Scheme } from "@/theme/colors";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "roselink.theme";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  scheme: Scheme;
  colors: (typeof palette)[Scheme];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setPreferenceState(saved);
          setColorScheme(saved);
        }
      })
      .catch(() => {});
    // lecture unique au démarrage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    setColorScheme(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  };

  const scheme: Scheme = colorScheme === "dark" ? "dark" : "light";

  const value = useMemo(
    () => ({ preference, setPreference, scheme, colors: palette[scheme] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preference, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme doit être utilisé dans AppThemeProvider");
  return context;
}