import { LocateFixed } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { OptionGroup } from "@/components/ui/option-group";
import { TAB_BAR_CLEARANCE } from "@/constants/layout";
import { CENTERS } from "@/data/centres";
import { CenterCard } from "@/features/centres/center-card";
import { CentersMap } from "@/features/centres/centers-map";
import { MapInfoCard } from "@/features/centres/map-info-card";
import type { MapPoint } from "@/features/centres/map-html";
import { rankCenters } from "@/features/centres/rank";
import { useUserPosition } from "@/features/centres/use-user-position";
import { OUAGADOUGOU } from "@/lib/geo";
import type { Option } from "@/types/account";

type Filter = "all" | "fixe" | "mobile";

const FILTERS: Option<Filter>[] = [
  { value: "all", label: "Tous" },
  { value: "fixe", label: "Centres fixes" },
  { value: "mobile", label: "Cliniques mobiles" },
];

export default function Carte() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { status, coords, locate } = useUserPosition();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const origin = coords ?? OUAGADOUGOU;

  const ranked = useMemo(() => rankCenters(CENTERS, origin), [origin]);
  const visible = useMemo(
    () => ranked.filter((item) => filter === "all" || item.center.type === filter),
    [ranked, filter],
  );
  const selected = visible.find((item) => item.center.id === selectedId) ?? null;

  const points = useMemo<MapPoint[]>(
    () =>
      visible.flatMap(({ center }) =>
        center.lat !== null && center.lng !== null
          ? [{ id: center.id, name: center.name, lat: center.lat, lng: center.lng, type: center.type }]
          : [],
      ),
    [visible],
  );

  const mapHeight = Math.round(Math.min(Math.max(height * 0.36, 240), 340));
  const withCoords = CENTERS.filter((c) => c.lat !== null && c.lng !== null).length;

  const positionText =
    status === "granted"
      ? "Distances à vol d'oiseau depuis votre position."
      : status === "loading"
        ? "Recherche de votre position…"
        : "Position non partagée : distances calculées depuis le centre de Ouagadougou.";

  const header = (
    <View className="gap-4 pb-4 pt-5">
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
        >
          Centres de dépistage
        </Text>
        <Text className="font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
          {positionText}
        </Text>
      </View>

      {status === "denied" || status === "error" ? (
        <View className="gap-1">
          <Button label="Activer ma position" icon={LocateFixed} variant="secondary" onPress={locate} />
          <Pressable
            onPress={() => Linking.openSettings().catch(() => {})}
            accessibilityRole="link"
            className="min-h-11 items-center justify-center"
          >
            <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
              Ouvrir les réglages du téléphone
            </Text>
          </Pressable>
        </View>
      ) : null}

      <OptionGroup label="Afficher" options={FILTERS} value={filter} onChange={setFilter} />

      {__DEV__ && withCoords < 3 ? (
        <Text className="font-jakarta text-xs text-alert dark:text-alert-dark">
          Développement : renseignez les coordonnées d'au moins 3 centres dans src/data/centres.ts.
        </Text>
      ) : null}
    </View>
  );

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <CentersMap
          points={points}
          user={coords}
          fallback={OUAGADOUGOU}
          selectedId={selected?.center.id ?? null}
          onSelect={setSelectedId}
          height={mapHeight}
        >
          {selected ? (
            <MapInfoCard
              center={selected.center}
              distanceKm={selected.distanceKm}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </CentersMap>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.center.id}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Text className="py-6 text-center font-jakarta text-sm text-ink-soft dark:text-ink-soft-dark">
            Aucun centre dans cette catégorie.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CenterCard
            center={item.center}
            distanceKm={item.distanceKm}
            selected={item.center.id === selected?.center.id}
            onPress={() => setSelectedId(item.center.id)}
          />
        )}
      />
    </View>
  );
}