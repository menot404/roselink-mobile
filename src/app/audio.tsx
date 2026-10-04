import { useLocalSearchParams } from "expo-router";
import { Info, Play, Volume2 } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { OptionGroup } from "@/components/ui/option-group";
import { SectionTitle } from "@/components/ui/section-title";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { PUBLISHED_TRACKS } from "@/data/audios";
import { formatTime } from "@/features/audio/format";
import { TrackPlayer } from "@/features/audio/track-player";
import { LANGUAGE_OPTIONS, labelOf, type Language } from "@/types/account";
import { THEME_LABELS, type AudioTheme, type AudioTrack } from "@/types/audio";

export default function Audio() {
    const params = useLocalSearchParams<{ id?: string }>();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { colors } = useAppTheme();
    const scrollRef = useRef<ScrollView>(null);

    const requested =
        typeof params.id === "string" ? PUBLISHED_TRACKS.find((t) => t.id === params.id) : undefined;

    const [language, setLanguage] = useState<Language>(requested?.language ?? user?.language ?? "fr");
    const [selectedId, setSelectedId] = useState<string | null>(requested?.id ?? null);

    const tracks = useMemo(
        () => PUBLISHED_TRACKS.filter((track) => track.language === language),
        [language],
    );

    const groups = useMemo(() => {
        const map = new Map<AudioTheme, AudioTrack[]>();
        for (const track of tracks) map.set(track.theme, [...(map.get(track.theme) ?? []), track]);
        return [...map.entries()];
    }, [tracks]);

    const selected = tracks.find((track) => track.id === selectedId) ?? null;
    const hasDemo = PUBLISHED_TRACKS.some((track) => track.demo);

    const choose = (track: AudioTrack) => {
        setSelectedId(track.id);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <ScrollView
            ref={scrollRef}
            className="flex-1 bg-canvas dark:bg-canvas-dark"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 20 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="gap-2">
                <Text
                    accessibilityRole="header"
                    className="font-jakarta-bold text-2xl text-ink dark:text-ink-dark"
                >
                    Conseils en audio
                </Text>
                <Text className="font-jakarta text-base leading-6 text-ink-soft dark:text-ink-soft-dark">
                    Écoutez des conseils courts, dans votre langue. Chaque audio affiche qui l'a enregistré et
                    validé.
                </Text>
            </View>

            <Card>
                <OptionGroup
                    label="Langue"
                    options={LANGUAGE_OPTIONS}
                    value={language}
                    onChange={(value) => {
                        setLanguage(value);
                        setSelectedId(null);
                    }}
                />
            </Card>

            {selected ? <TrackPlayer key={selected.id} track={selected} /> : null}

            {tracks.length === 0 ? (
                <Card className="gap-3">
                    <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
                        Bientôt en {labelOf(LANGUAGE_OPTIONS, language)}
                    </Text>
                    <Text className="font-jakarta text-sm leading-5 text-ink-soft dark:text-ink-soft-dark">
                        Les enregistrements en {labelOf(LANGUAGE_OPTIONS, language)} sont en préparation avec des
                        locutrices natives et des professionnels de santé. En attendant, vous pouvez écouter
                        les versions en français.
                    </Text>
                    <Button label="Écouter en français" variant="secondary" onPress={() => setLanguage("fr")} />
                </Card>
            ) : (
                groups.map(([theme, items]) => (
                    <View key={theme} className="gap-3">
                        <SectionTitle>{THEME_LABELS[theme]}</SectionTitle>
                        {items.map((track) => {
                            const isSelected = track.id === selected?.id;
                            return (
                                <Pressable
                                    key={track.id}
                                    onPress={() => choose(track)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`${track.title}, ${formatTime(track.durationSec)}`}
                                    accessibilityState={{ selected: isSelected }}
                                    className={`flex-row items-center gap-3 rounded-2xl border bg-surface p-3 active:opacity-80 dark:bg-surface-dark ${isSelected
                                            ? "border-2 border-primary dark:border-primary-dark"
                                            : "border-line dark:border-line-dark"
                                        }`}
                                >
                                    <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft-dark">
                                        {isSelected ? (
                                            <Volume2 size={20} color={colors.primary} />
                                        ) : (
                                            <Play size={18} color={colors.primary} fill={colors.primary} />
                                        )}
                                    </View>
                                    <View className="flex-1 gap-0.5">
                                        <Text className="font-jakarta-bold text-base text-ink dark:text-ink-dark">
                                            {track.title}
                                        </Text>
                                        <Text className="font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
                                            {formatTime(track.durationSec)}
                                            {track.demo ? " · voix de démonstration" : ""}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                ))
            )}

            {hasDemo ? (
                <View className="flex-row items-start gap-2">
                    <Info size={14} color={colors.inkSoft} style={{ marginTop: 2 }} />
                    <Text className="flex-1 font-jakarta text-xs leading-4 text-ink-soft dark:text-ink-soft-dark">
                        Les sons de cette version de démonstration remplacent les enregistrements d'experts, en
                        cours de préparation.
                    </Text>
                </View>
            ) : null}

            <Disclaimer />
        </ScrollView>
    );
}