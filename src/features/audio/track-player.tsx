import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw, RotateCw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View, type LayoutChangeEvent } from "react-native";

import { useAppTheme } from "@/context/theme-context";
import type { AudioTrack } from "@/types/audio";

import { ExpertBadge } from "./expert-badge";
import { formatTime } from "./format";

const SKIP_SECONDS = 10;

/** À utiliser avec key={track.id} : le lecteur est recréé à chaque changement d'audio. */
export function TrackPlayer({ track }: { track: AudioTrack }) {
    const { colors } = useAppTheme();
    const player = useAudioPlayer(track.source);
    const status = useAudioPlayerStatus(player);
    const [barWidth, setBarWidth] = useState(0);
    const [showText, setShowText] = useState(false);

    const duration = status.duration > 0 ? status.duration : track.durationSec;
    const position = Math.min(status.currentTime, duration);
    const ratio = duration > 0 ? position / duration : 0;

    useEffect(() => {
        setAudioModeAsync({ playsInSilentMode: true }).catch(() => { });
    }, []);

    // lecture automatique dès que le fichier est chargé
    useEffect(() => {
        if (status.isLoaded) player.play();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status.isLoaded]);

    const toggle = () => {
        if (status.playing) {
            player.pause();
            return;
        }
        // expo-audio ne revient pas au début tout seul à la fin d'un audio
        if (duration > 0 && position >= duration - 0.25) void player.seekTo(0);
        player.play();
    };

    const skip = (delta: number) => {
        void player.seekTo(Math.max(0, Math.min(duration, position + delta)));
    };

    const seekFromTouch = (x: number) => {
        if (barWidth <= 0 || duration <= 0) return;
        void player.seekTo(Math.max(0, Math.min(1, x / barWidth)) * duration);
    };

    return (
        <View className="gap-4 rounded-3xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark">
            <View className="gap-2">
                <Text
                    accessibilityRole="header"
                    className="font-jakarta-bold text-xl leading-7 text-ink dark:text-ink-dark"
                >
                    {track.title}
                </Text>
                <ExpertBadge track={track} />
            </View>

            <View className="gap-1">
                <Pressable
                    onPress={(event) => seekFromTouch(event.nativeEvent.locationX)}
                    onLayout={(event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width)}
                    accessibilityRole="adjustable"
                    accessibilityLabel="Position dans l'audio"
                    accessibilityValue={{ min: 0, max: Math.round(duration), now: Math.round(position) }}
                    style={{ height: 32, justifyContent: "center" }}
                >
                    <View
                        pointerEvents="none"
                        style={{ height: 6, borderRadius: 3, backgroundColor: colors.primarySoft }}
                    >
                        <View
                            style={{
                                height: 6,
                                borderRadius: 3,
                                width: `${Math.round(ratio * 100)}%`,
                                backgroundColor: colors.primary,
                            }}
                        />
                    </View>
                </Pressable>
                <View className="flex-row justify-between">
                    <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
                        {formatTime(position)}
                    </Text>
                    <Text className="font-jakarta-medium text-xs text-ink-soft dark:text-ink-soft-dark">
                        {formatTime(duration)}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-center gap-6">
                <Pressable
                    onPress={() => skip(-SKIP_SECONDS)}
                    accessibilityRole="button"
                    accessibilityLabel="Reculer de 10 secondes"
                    className="h-12 w-12 items-center justify-center rounded-full active:opacity-70"
                >
                    <RotateCcw size={26} color={colors.inkSoft} />
                </Pressable>

                <Pressable
                    onPress={toggle}
                    disabled={!status.isLoaded}
                    accessibilityRole="button"
                    accessibilityLabel={status.playing ? "Pause" : "Lecture"}
                    className={`h-[72px] w-[72px] items-center justify-center rounded-full bg-primary active:opacity-80 dark:bg-primary-dark ${status.isLoaded ? "" : "opacity-50"
                        }`}
                >
                    {status.playing ? (
                        <Pause size={32} color={colors.onPrimary} fill={colors.onPrimary} />
                    ) : (
                        <Play size={32} color={colors.onPrimary} fill={colors.onPrimary} />
                    )}
                </Pressable>

                <Pressable
                    onPress={() => skip(SKIP_SECONDS)}
                    accessibilityRole="button"
                    accessibilityLabel="Avancer de 10 secondes"
                    className="h-12 w-12 items-center justify-center rounded-full active:opacity-70"
                >
                    <RotateCw size={26} color={colors.inkSoft} />
                </Pressable>
            </View>

            {!status.isLoaded ? (
                <Text className="text-center font-jakarta text-xs text-ink-soft dark:text-ink-soft-dark">
                    Chargement de l'audio…
                </Text>
            ) : null}

            <Pressable
                onPress={() => setShowText((value) => !value)}
                accessibilityRole="button"
                accessibilityState={{ expanded: showText }}
                className="min-h-11 flex-row items-center justify-center gap-2 rounded-full bg-primary-soft px-4 active:opacity-80 dark:bg-primary-soft-dark"
            >
                <Text className="font-jakarta-semibold text-sm text-primary dark:text-primary-dark">
                    {showText ? "Masquer le texte" : "Lire le texte"}
                </Text>
                {showText ? (
                    <ChevronUp size={16} color={colors.primary} />
                ) : (
                    <ChevronDown size={16} color={colors.primary} />
                )}
            </Pressable>

            {showText ? (
                <Text selectable className="font-jakarta text-base leading-7 text-ink dark:text-ink-dark">
                    {track.transcript}
                </Text>
            ) : null}
        </View>
    );
}