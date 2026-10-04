import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, ExternalLink, Heart, Info } from "lucide-react-native";
import { Linking, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

import { SHOW_REVIEW_BADGE } from "./config";
import { SOURCES } from "./knowledge";
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

type Props = { message: ChatMessage; onAction: (href: ChatRoute) => void };

export function ChatBubble({ message, onAction }: Props) {
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

  // une seule pastille par organisme (par exemple « OMS » une seule fois)
  const sources = message.sourceIds
    .map((id) => SOURCES[id])
    .filter((source, index, all) => all.findIndex((s) => s.short === source.short) === index);

  return (
    <View className="flex-row items-start gap-2">
      <Avatar />
      <View style={{ maxWidth: "85%", flexShrink: 1 }} className="gap-2">
        <View className="rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 dark:border-line-dark dark:bg-surface-dark">
          <Text
            selectable
            className="font-jakarta text-[15px] leading-6 text-ink dark:text-ink-dark"
          >
            {message.text}
          </Text>
        </View>

        {message.actions.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {message.actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => onAction(action.href)}
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

        {sources.length > 0 ? (
          <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
            <Text className="font-jakarta text-[11px] text-ink-soft dark:text-ink-soft-dark">
              Sources :
            </Text>
            {sources.map((source) => (
              <Pressable
                key={source.id}
                onPress={() => Linking.openURL(source.url).catch(() => {})}
                accessibilityRole="link"
                accessibilityLabel={`Ouvrir la source ${source.short}`}
                hitSlop={8}
                className="flex-row items-center gap-1"
              >
                <Text className="font-jakarta-semibold text-[11px] text-primary dark:text-primary-dark">
                  {source.short}
                </Text>
                <ExternalLink size={11} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        ) : null}

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
}
