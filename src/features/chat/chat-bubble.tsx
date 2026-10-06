import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Heart, Info } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import type { ChatAction } from "./knowledge/types";

import { SourceLinks } from "@/components/ui/source-links";
import { useAppTheme } from "@/context/theme-context";

import { SHOW_REVIEW_BADGE } from "./config";
import type { ChatRoute } from "./knowledge/types";
import type { ChatMessage } from "./message";
import { TypingDots } from "./typing-dots";

function Avatar() {
  return (
    <LinearGradient
      colors={["#E8467C", "#B02558"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      <Heart size={15} color="#FFFFFF" fill="#FFFFFF" />
    </LinearGradient>
  );
}

export function TypingBubble() {
  return (
    <View className="flex-row items-start gap-2">
      <Avatar />
      <View className="rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-2 dark:border-line-dark dark:bg-surface-dark">
        <TypingDots />
      </View>
    </View>
  );
}

type Props = { message: ChatMessage; onAction: (action: ChatAction) => void };

/** Mémorisé : une bulle n'est redessinée que si son message change. */
export const ChatBubble = memo(function ChatBubble({ message, onAction }: Props) {
  const { colors } = useAppTheme();

  if (message.role === "user") {
    return (
      <View className="items-end">
        <View
          style={{ maxWidth: "85%" }}
          className="rounded-2xl rounded-br-md bg-primary px-4 py-3 dark:bg-primary-dark"
        >
          <Text className="font-jakarta-medium text-[15px] leading-6 text-on-primary dark:text-on-primary-dark">
            {message.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-start gap-2">
      <Avatar />
      <View style={{ maxWidth: "85%", flexShrink: 1 }} className="gap-2">
        <View className="rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 dark:border-line-dark dark:bg-surface-dark">
          <Text className="font-jakarta text-[15px] leading-6 text-ink dark:text-ink-dark">
            {message.text}
          </Text>
        </View>

        {message.actions.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {message.actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => onAction(action)}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                className="min-h-11 flex-row items-center gap-2 rounded-full bg-primary-soft px-4 active:opacity-80 dark:bg-primary-soft-dark"
              >
                <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
                  {action.label}
                </Text>
                <ArrowRight size={16} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <SourceLinks ids={message.sourceIds} />

        {SHOW_REVIEW_BADGE && message.needsReview ? (
          <View className="flex-row items-center gap-1.5">
            <Info size={12} color={colors.inkSoft} />
            <Text className="flex-1 font-jakarta text-[11px] text-ink-soft dark:text-ink-soft-dark">
              Contenu en cours de relecture par un professionnel de santé.
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
