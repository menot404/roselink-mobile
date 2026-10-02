import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_CLEARANCE } from "@/constants/layout";
import { useTabBarSpace } from "@/context/tab-bar-space";

type Props = {
  children: ReactNode;
  padTop?: boolean;
  /** Obsolète : détecté automatiquement dans les onglets */
  withTabBar?: boolean;
};

export function Screen({ children, padTop = true, withTabBar = false }: Props) {
  const insets = useSafeAreaInsets();
  const inTabs = useTabBarSpace();
  const hasTabBar = inTabs || withTabBar;
  const paddingTop = padTop && !inTabs ? insets.top + 16 : 16;

  return (
    <ScrollView
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      contentContainerStyle={{
        paddingTop,
        paddingBottom: insets.bottom + (hasTabBar ? TAB_BAR_CLEARANCE : 32),
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center", gap: 20 }}>
        {children}
      </View>
    </ScrollView>
  );
}