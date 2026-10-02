import { Tabs } from "expo-router";

import { FloatingTabBar } from "@/components/navigation/floating-tab-bar";
import { TopBar } from "@/components/navigation/top-bar";
import { TabBarSpaceContext } from "@/context/tab-bar-space";

export default function TabsLayout() {
  return (
    <TabBarSpaceContext.Provider value>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{ header: () => <TopBar /> }}
      >
        <Tabs.Screen name="accueil" options={{ title: "Accueil" }} />
        <Tabs.Screen name="parcours" options={{ title: "Parcours" }} />
        <Tabs.Screen name="carte" options={{ title: "Carte" }} />
        <Tabs.Screen name="chat" options={{ title: "Chat" }} />
        <Tabs.Screen name="association" options={{ title: "Association" }} />
      </Tabs>
    </TabBarSpaceContext.Provider>
  );
}