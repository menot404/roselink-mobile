import { LocateFixed, WifiOff } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { useAppTheme } from "@/context/theme-context";
import type { Coords } from "@/lib/geo";

import { buildMapHtml, type MapPoint } from "./map-html";

type Props = {
  points: MapPoint[];
  user: Coords | null;
  fallback: Coords;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  height: number;
  children?: ReactNode;
};

export function CentersMap({ points, user, fallback, selectedId, onSelect, height, children }: Props) {
  const { scheme, colors } = useAppTheme();
  const webRef = useRef<WebView>(null);
  const [offline, setOffline] = useState(false);

  const html = useMemo(
    () => buildMapHtml({ points, user, fallback, scheme }),
    [points, user, fallback, scheme],
  );

  const applySelection = () => {
    const script = selectedId
      ? `window.focusCenter && window.focusCenter(${JSON.stringify(selectedId)}); true;`
      : "window.clearSelection && window.clearSelection(); true;";
    webRef.current?.injectJavaScript(script);
  };

  useEffect(() => {
    applySelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    setOffline(false);
  }, [html]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type: string; id?: string };
      if (message.type === "select" && message.id) onSelect(message.id);
      else if (message.type === "clear") onSelect(null);
      else if (message.type === "offline") setOffline(true);
    } catch {
      // message illisible : ignoré
    }
  };

  return (
    <View
      style={{
        height,
        borderRadius: 28,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.primarySoft,
      }}
    >
      <WebView
        ref={webRef}
        source={{ html }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        onLoadEnd={applySelection}
        scrollEnabled={false}
        overScrollMode="never"
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: colors.primarySoft }}
        accessibilityLabel="Carte des centres de dépistage"
      />

      {offline ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 24,
            backgroundColor: colors.primarySoft,
          }}
        >
          <WifiOff size={32} color={colors.primary} />
          <Text className="text-center font-jakarta-bold text-base text-ink dark:text-ink-dark">
            Carte indisponible hors connexion
          </Text>
          <Text className="text-center font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
            La liste des centres ci-dessous reste disponible.
          </Text>
        </View>
      ) : null}

      {user && !offline ? (
        <Pressable
          onPress={() =>
            webRef.current?.injectJavaScript("window.centerOnUser && window.centerOnUser(); true;")
          }
          accessibilityRole="button"
          accessibilityLabel="Centrer la carte sur ma position"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <LocateFixed size={22} color={colors.primary} />
        </Pressable>
      ) : null}

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}
      >
        {children}
      </View>
    </View>
  );
}