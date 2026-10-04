import { useRouter } from "expo-router";
import { Info, Send, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_CLEARANCE } from "@/constants/layout";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { ChatBubble, TypingBubble } from "@/features/chat/chat-bubble";
import { getReply } from "@/features/chat/engine";
import { START_SUGGESTIONS } from "@/features/chat/knowledge";
import type { ChatRoute } from "@/features/chat/knowledge/types";
import { newId, type ChatMessage } from "@/features/chat/message";
import { selfCheck } from "@/features/chat/selfcheck";
import { useKeyboardVisible } from "@/lib/use-keyboard-visible";

function welcome(firstName?: string, support?: boolean): ChatMessage {
  const hello = firstName ? `Bonjour ${firstName}` : "Bonjour";
  const extra = support
    ? " L'espace d'écoute pour les femmes déjà diagnostiquées arrive bientôt ; en attendant, je peux répondre à vos questions d'information."
    : "";
  return {
    id: newId(),
    role: "assistant",
    text: `${hello}, je suis l'assistante RoseLink. Je réponds à vos questions sur le sein et le dépistage, sans jugement. Je ne remplace pas un professionnel de santé.${extra}`,
    actions: [],
    sourceIds: [],
    needsReview: false,
  };
}

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const keyboardVisible = useKeyboardVisible();

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIntent = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    welcome(user?.firstName, user?.profile === "support"),
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(START_SUGGESTIONS);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (__DEV__) {
      const problems = selfCheck();
      if (problems.length > 0) {
        console.warn(`Chat : ${problems.length} problème(s)\n${problems.join("\n")}`);
      }
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    setDraft("");
    setSuggestions([]);
    setMessages((previous) => [...previous, { id: newId(), role: "user", text }]);
    setTyping(true);

    const answer = getReply(text, lastIntent.current);
    lastIntent.current = answer.intentId;

    // délai de « réflexion » proportionnel à la longueur de la réponse
    const delay = Math.min(1800, 700 + answer.text.length * 5);
    timer.current = setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: newId(),
          role: "assistant",
          text: answer.text,
          actions: answer.actions,
          sourceIds: answer.sourceIds,
          needsReview: answer.needsReview,
        },
      ]);
      setSuggestions(answer.followUps.length > 0 ? answer.followUps : START_SUGGESTIONS);
      setTyping(false);
    }, delay);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    lastIntent.current = null;
    setTyping(false);
    setDraft("");
    setSuggestions(START_SUGGESTIONS);
    setMessages([welcome(user?.firstName, user?.profile === "support")]);
  };

  const onAction = (href: ChatRoute) => router.push(href);
  const canSend = draft.trim().length > 0 && !typing;

  const footer = (
    <View style={{ gap: 12 }}>
      {typing ? <TypingBubble /> : null}
      {!typing && suggestions.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {suggestions.slice(0, 4).map((label) => (
            <Pressable
              key={label}
              onPress={() => send(label)}
              accessibilityRole="button"
              accessibilityLabel={label}
              className="min-h-11 justify-center rounded-full border border-primary px-4 active:opacity-80 dark:border-primary-dark"
            >
              <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={insets.top + 65}
      className="flex-1 bg-canvas dark:bg-canvas-dark"
    >
      <View className="flex-row items-center gap-3 border-b border-line px-4 py-2 dark:border-line-dark">
        <Info size={18} color={colors.primary} />
        <Text className="flex-1 font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
          RoseLink informe et oriente. Elle ne remplace pas un professionnel de santé.
        </Text>
        <Pressable
          onPress={reset}
          accessibilityRole="button"
          accessibilityLabel="Effacer la conversation"
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
        >
          <Trash2 size={18} color={colors.inkSoft} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} onAction={onAction} />}
        ListFooterComponent={footer}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: keyboardVisible ? 8 : insets.bottom + TAB_BAR_CLEARANCE - 16,
        }}
      >
        <View className="flex-row items-end gap-2 rounded-3xl border border-line bg-surface p-2 dark:border-line-dark dark:bg-surface-dark">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Écrivez votre question…"
            placeholderTextColor={colors.inkSoft}
            selectionColor={colors.primary}
            multiline
            maxLength={400}
            accessibilityLabel="Votre question"
            style={{
              flex: 1,
              minHeight: 40,
              maxHeight: 110,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontFamily: "PlusJakartaSans_500Medium",
              fontSize: 16,
              color: colors.ink,
            }}
          />
          <Pressable
            onPress={() => send(draft)}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Envoyer"
            className={`h-11 w-11 items-center justify-center rounded-full ${
              canSend ? "bg-primary dark:bg-primary-dark" : "bg-primary-soft dark:bg-primary-soft-dark"
            }`}
          >
            <Send size={20} color={canSend ? colors.onPrimary : colors.inkSoft} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}