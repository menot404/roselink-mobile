import { BadgeCheck, Mic } from "lucide-react-native";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";
import type { AudioTrack } from "@/types/audio";

export function ExpertBadge({ track }: { track: AudioTrack }) {
  const { colors } = useAppTheme();

  if (track.demo) {
    return (
      <View className="flex-row items-center gap-1.5 self-start rounded-full border border-line px-2.5 py-1 dark:border-line-dark">
        <Mic size={12} color={colors.inkSoft} />
        <Text className="font-jakarta-semibold text-[11px] text-ink-soft dark:text-ink-soft-dark">
          Voix de démonstration
        </Text>
      </View>
    );
  }

  const who = [track.expert.name, track.expert.role].filter(Boolean).join(", ");

  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary-soft px-2.5 py-1 dark:bg-primary-soft-dark">
      <BadgeCheck size={13} color={colors.primary} />
      <Text className="shrink font-jakarta-semibold text-[11px] text-primary dark:text-primary-dark">
        Validé par {who}
        {track.validatedAt ? ` · ${track.validatedAt}` : ""}
      </Text>
    </View>
  );
}