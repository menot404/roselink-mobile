import { useRouter } from "expo-router";
import { HeartHandshake, Info, Phone } from "lucide-react-native";
import { Linking, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { SourceLinks } from "@/components/ui/source-links";
import { useAppTheme } from "@/context/theme-context";
import type { Association } from "@/types/association";

export function AssociationCard({ association }: { association: Association }) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { phone } = association;

  return (
    <View className="gap-4 rounded-3xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark">
      <View className="flex-row items-start gap-3">
        <IconBadge icon={HeartHandshake} size={48} />
        <View className="flex-1 gap-1">
          <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
            {association.name}
          </Text>
          <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
            {association.tagline}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {association.services.map((service) => (
          <View
            key={service}
            className="rounded-full border border-line px-3 py-1 dark:border-line-dark"
          >
            <Text className="font-jakarta text-xs text-ink dark:text-ink-dark">{service}</Text>
          </View>
        ))}
      </View>

      {!association.verified || association.note ? (
        <View className="flex-row items-start gap-1.5">
          <Info size={14} color={colors.inkSoft} style={{ marginTop: 1 }} />
          <Text className="flex-1 font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
            {association.note ?? "Informations à confirmer auprès de l'association."}
          </Text>
        </View>
      ) : null}

      <SourceLinks ids={association.sources} />

      <View className="gap-2">
        {phone ? (
          <Button
            label="Appeler"
            icon={Phone}
            onPress={() => Linking.openURL(`tel:${phone.replace(/\s/g, "")}`).catch(() => {})}
          />
        ) : (
          <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
            Coordonnées à confirmer.
          </Text>
        )}
        <Button
          label="Demander de l'aide"
          variant="secondary"
          onPress={() =>
            router.push({ pathname: "/aide", params: { association: association.id } })
          }
        />
      </View>
    </View>
  );
}