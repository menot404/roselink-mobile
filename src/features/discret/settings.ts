import AsyncStorage from "@react-native-async-storage/async-storage";

export type DiscreetSettings = {
  /** Bouton « Quitter vite » visible en haut des écrans */
  quickExit: boolean;
  /** Masque l'aperçu dans les applications récentes et bloque les captures d'écran */
  hidePreview: boolean;
  /** Notifications sans aucun mot lié à la santé */
  discreetNotifications: boolean;
};

export const DEFAULT_SETTINGS: DiscreetSettings = {
  quickExit: false,
  hidePreview: false,
  discreetNotifications: true,
};

export const SETTINGS_KEY = "roselink.discreet.settings";

export async function loadSettings(): Promise<DiscreetSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<DiscreetSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DiscreetSettings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // réglage non enregistré : sans conséquence grave
  }
}