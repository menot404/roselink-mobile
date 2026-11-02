import { useRouter } from "expo-router";
import { EyeOff } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable } from "react-native";

import { useAppTheme } from "@/context/theme-context";

import { useDiscreet } from "./discreet-context";

/** Vide l'historique de navigation puis ouvre l'écran neutre. */
export function useQuickExit() {
  const router = useRouter();
  return useCallback(() => {
    if (router.canDismiss()) router.dismissAll();
    router.replace("/neutre");
  }, [router]);
}

/** Petit bouton « Quitter vite », visible seulement si l'option est activée. */
export function QuickExitButton() {
  const { colors } = useAppTheme();
  const { settings } = useDiscreet();
  const quickExit = useQuickExit();

  if (!settings.quickExit) return null;

  return (
    <Pressable
      onPress={quickExit}
      accessibilityRole="button"
      accessibilityLabel="Quitter vite"
      className="h-11 w-11 items-center justify-center rounded-full border border-line bg-surface active:opacity-70 dark:border-line-dark dark:bg-surface-dark"
    >
      <EyeOff size={20} color={colors.inkSoft} />
    </Pressable>
  );
}