import { Sparkles, type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { Disclaimer } from "./disclaimer";
import { Header } from "./header";
import { IconBadge } from "./icon-badge";
import { Screen } from "./screen";

type Props = { title: string; subtitle: string; description: string; icon?: LucideIcon };

export function ComingSoon({ title, subtitle, description, icon = Sparkles }: Props) {
  return (
    <Screen>
      <Header title={title} subtitle={subtitle} />
      <View className="items-center gap-4 rounded-3xl border border-line bg-surface p-8 dark:border-line-dark dark:bg-surface-dark">
        <IconBadge icon={icon} size={64} />
        <View className="rounded-full bg-primary-soft px-3 py-1 dark:bg-primary-soft-dark">
          <Text className="font-jakarta-semibold text-xs text-primary dark:text-primary-dark">
            Bientôt disponible
          </Text>
        </View>
        <Text className="text-center font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
          {description}
        </Text>
      </View>
      <Disclaimer />
    </Screen>
  );
}