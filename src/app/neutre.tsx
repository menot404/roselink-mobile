import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDiscreet } from "@/features/discret/discreet-context";

/** Faux écran de notes, volontairement banal et sans rapport avec RoseLink. */
const NOTES = [
  { title: "Courses", text: "Riz, tomates, oignons, huile, savon" },
  { title: "À faire", text: "Appeler le plombier\nPayer la facture d'eau\nRéparer le portail" },
  { title: "Idées cadeau", text: "Un foulard pour tante Awa\nUn livre pour Karim" },
];

export default function Neutre() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lockNow } = useDiscreet();

  // pour revenir : maintenir le doigt sur le titre pendant 1,5 seconde
  const back = () => {
    lockNow();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
          gap: 14,
        }}
      >
        <Pressable onLongPress={back} delayLongPress={1500}>
          <Text style={{ fontSize: 30, fontWeight: "700", color: "#1F2937" }}>Mes notes</Text>
        </Pressable>
        {NOTES.map((note) => (
          <View
            key={note.title}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              gap: 6,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "600", color: "#111827" }}>{note.title}</Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: "#4B5563" }}>{note.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}