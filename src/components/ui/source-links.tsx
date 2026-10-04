import { ExternalLink } from "lucide-react-native";
import { Linking, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";
import { SOURCES } from "@/features/chat/knowledge/sources";
import type { SourceId } from "@/features/chat/knowledge/types";

/** Affiche « Sources : OMS · Sidwaya… » avec un lien vers chaque source. */
export function SourceLinks({ ids }: { ids: SourceId[] }) {
  const { colors } = useAppTheme();

  // une seule pastille par organisme (par exemple « OMS » une seule fois)
  const sources = ids
    .map((id) => SOURCES[id])
    .filter((source, index, all) => all.findIndex((s) => s.short === source.short) === index);

  if (sources.length === 0) return null;

  return (
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
  );
}
