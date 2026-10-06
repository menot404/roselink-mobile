import { useRouter } from "expo-router";
import { Info, Send, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  InteractionManager,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_CLEARANCE } from "@/constants/layout";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { ChatBubble, TypingBubble } from "@/features/chat/chat-bubble";
import { getReply } from "@/features/chat/engine";
import { START_SUGGESTIONS, SUPPORT_START_SUGGESTIONS } from "@/features/chat/knowledge";
import type { ChatAction, ChatMode } from "@/features/chat/knowledge/types";
import { newId, type ChatMessage } from "@/features/chat/message";
import { selfCheck } from "@/features/chat/selfcheck";
import { useKeyboardVisible } from "@/lib/use-keyboard-visible";

const keyExtractor = (item: ChatMessage) => item.id;
const listContent = { padding: 16, gap: 14 } as const;

const COPY: Record<
  ChatMode,
  { banner: string; placeholder: string; suggestions: string[]; welcome: string }
> = {
  prevention: {
    banner: "RoseLink informe et oriente. Elle ne remplace pas un professionnel de santé.",
    placeholder: "Écrivez votre question…",
    suggestions: START_SUGGESTIONS,
    welcome:
      "je suis l'assistante RoseLink. Je réponds à vos questions sur le sein et le dépistage, sans jugement. Je ne remplace pas un professionnel de santé.",
  },
  support: {
    banner: "RoseLink vous écoute et vous oriente. Elle ne remplace pas votre équipe soignante.",
    placeholder: "Écrivez ce que vous ressentez…",
    suggestions: SUPPORT_START_SUGGESTIONS,
    welcome:
      "je suis l'assistante RoseLink. Cet espace est le vôtre : vous pouvez me parler de ce que vous ressentez ou me poser vos questions sur le traitement et la vie de tous les jours, sans jugement. Je ne remplace pas votre équipe soignante.",
  },
};

function welcome(firstName: string | undefined, mode: ChatMode): ChatMessage {
  const hello = firstName ? `Bonjour ${firstName}` : "Bonjour";
  return {
    id: newId(),
    role: "assistant",
    text: `${hello}, ${COPY[mode].welcome}`,
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

  const mode: ChatMode = user?.profile === "support" ? "support" : "prevention";
  const copy = COPY[mode];

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIntent = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcome(user?.firstName, mode)]);
  const [suggestions, setSuggestions] = useState<string[]>(copy.suggestions);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // vérification des bases : en développement seulement, et après l'affichage de l'écran
    const task = __DEV__
      ? InteractionManager.runAfterInteractions(() => {
          const problems = selfCheck();
          if (problems.length > 0) {
            console.warn(`Chat : ${problems.length} problème(s)\n${problems.join("\n")}`);
          }
        })
      : null;
    return () => {
      task?.cancel();
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

    const answer = getReply(text, lastIntent.current, mode);
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
      setSuggestions(answer.followUps.length > 0 ? answer.followUps : copy.suggestions);
      setTyping(false);
    }, delay);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    lastIntent.current = null;
    setTyping(false);
    setDraft("");
    setSuggestions(copy.suggestions);
    setMessages([welcome(user?.firstName, mode)]);
  };

  const onAction = useCallback(
    (action: ChatAction) => {
      const target = action.params
        ? { pathname: action.href, params: action.params }
        : action.href;
      router.push(target as Parameters<typeof router.push>[0]);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <ChatBubble message={item} onAction={onAction} />,
    [onAction],
  );

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
          {copy.banner}
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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={footer}
        contentContainerStyle={listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={9}
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
            placeholder={copy.placeholder}
            placeholderTextColor={colors.inkSoft}
            selectionColor={colors.primary}
            multiline
            maxLength={400}
            accessibilityLabel="Votre message"
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