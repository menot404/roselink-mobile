import { Tabs } from "expo-router";
import {
  HeartHandshake,
  House,
  MapPin,
  MessageCircle,
  Route,
  type LucideIcon,
} from "lucide-react-native";

import { useAppTheme } from "@/context/theme-context";

export default function TabsLayout() {
  const { colors } = useAppTheme();

  const icon =
    (Icon: LucideIcon) =>
    ({ focused, size }: { focused: boolean; size: number }) => (
      <Icon size={size} color={focused ? colors.primary : colors.inkSoft} />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: "PlusJakartaSans_600SemiBold", fontSize: 11 },
      }}
    >
      <Tabs.Screen name="accueil" options={{ title: "Accueil", tabBarIcon: icon(House) }} />
      <Tabs.Screen name="parcours" options={{ title: "Parcours", tabBarIcon: icon(Route) }} />
      <Tabs.Screen name="carte" options={{ title: "Carte", tabBarIcon: icon(MapPin) }} />
      <Tabs.Screen name="chat" options={{ title: "Chat", tabBarIcon: icon(MessageCircle) }} />
      <Tabs.Screen
        name="association"
        options={{ title: "Association", tabBarIcon: icon(HeartHandshake) }}
      />
    </Tabs>
  );
}