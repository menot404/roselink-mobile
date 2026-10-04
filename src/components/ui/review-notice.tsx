import { Info } from "lucide-react-native";
import { Text, View } from "react-native";

import { useAppTheme } from "@/context/theme-context";

type Props = { validated?: boolean; reviewer?: string; reviewedAt?: string };

/** Mention de relecture : à passer en « validé » une fois le contenu relu par un professionnel de santé. */
export function ReviewNotice({ validated = false, reviewer, reviewedAt }: Props) {
  const { colors } = useAppTheme();
  const text = validated
    ? `Contenu validé par ${reviewer ?? "un professionnel de santé"}${
        reviewedAt ? ` le ${reviewedAt}` : ""
      }.`
    : "Contenu en cours de relecture par un professionnel de santé.";

  return (
    <View className="flex-row items-center justify-center gap-1.5">
      <Info size={13} color={colors.inkSoft} />
      <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">{text}</Text>
    </View>
  );
}
