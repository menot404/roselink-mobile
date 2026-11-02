import { LinearGradient } from "expo-linear-gradient";
import { useKeyboardVisible } from "@/lib/use-keyboard-visible";
import {
  HeartHandshake,
  House,
  MapPin,
  MessageCircleHeart,
  Route,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_HEIGHT, TAB_CENTER_LIFT, TAB_CENTER_SIZE } from "@/constants/layout";
import { useAppTheme } from "@/context/theme-context";

/* eslint-disable @typescript-eslint/no-explicit-any */
type TabBarProps = {
  state: { index: number; routes: readonly { key: string; name: string }[] };
  navigation: {
    emit: (...args: any[]) => any;
    navigate: (...args: any[]) => any;
  };
};

const TABS: Record<string, { label: string; Icon: LucideIcon }> = {
  accueil: { label: "Accueil", Icon: House },
  parcours: { label: "Parcours", Icon: Route },
  carte: { label: "Carte", Icon: MapPin },
  chat: { label: "Chat", Icon: MessageCircleHeart },
  association: { label: "Association", Icon: HeartHandshake },
};

export function FloatingTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useAppTheme();
  const keyboardVisible = useKeyboardVisible();
  if (keyboardVisible) return null;

  const centerIndex = Math.floor(state.routes.length / 2);
  const centerGradient =
    scheme === "dark"
      ? (["#FF8DB3", "#F06A98"] as const)
      : (["#E8467C", "#D6336C"] as const);
  const innerSize = TAB_CENTER_SIZE - 10;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: insets.bottom + 12,
        height: TAB_BAR_HEIGHT + TAB_CENTER_LIFT,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: TAB_BAR_HEIGHT,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOpacity: scheme === "dark" ? 0.5 : 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      />

      <View style={{ flexDirection: "row", height: "100%", alignItems: "flex-end" }}>
        {state.routes.map((route, index) => {
          const config = TABS[route.name];
          if (!config) return null;

          const { label, Icon } = config;
          const focused = state.index === index;
          const isCenter = index === centerIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          const labelNode = (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                fontFamily: "PlusJakartaSans_600SemiBold",
                fontSize: 10,
                color: focused ? colors.primary : colors.inkSoft,
              }}
            >
              {label}
            </Text>
          );

          if (isCenter) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: focused }}
                style={{ flex: 1, height: TAB_BAR_HEIGHT + TAB_CENTER_LIFT, alignItems: "center" }}
              >
                <View
                  style={{
                    width: TAB_CENTER_SIZE,
                    height: TAB_CENTER_SIZE,
                    borderRadius: TAB_CENTER_SIZE / 2,
                    borderWidth: 2,
                    borderColor: focused ? colors.primary : "transparent",
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinearGradient
                    colors={centerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: innerSize,
                      height: innerSize,
                      borderRadius: innerSize / 2,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: colors.primary,
                      shadowOpacity: 0.45,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 10,
                    }}
                  >
                    <Icon size={26} color={colors.onPrimary} strokeWidth={2.4} />
                  </LinearGradient>
                </View>
                <View style={{ marginTop: 6 }}>{labelNode}</View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              style={{
                flex: 1,
                height: TAB_BAR_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  alignSelf: "stretch",
                  marginHorizontal: 3,
                  alignItems: "center",
                  gap: 2,
                  paddingVertical: 7,
                  borderRadius: 22,
                  borderWidth: 1.5,
                  borderColor: focused ? colors.primary : "transparent",
                  backgroundColor: focused ? colors.primarySoft : "transparent",
                }}
              >
                <Icon
                  size={22}
                  color={focused ? colors.primary : colors.inkSoft}
                  strokeWidth={focused ? 2.4 : 2}
                />
                {labelNode}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}