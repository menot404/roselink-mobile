import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { children: ReactNode; padTop?: boolean };

export function Screen({ children, padTop = true }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      contentContainerStyle={{
        paddingTop: padTop ? insets.top + 16 : 16,
        paddingBottom: insets.bottom + 32,
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