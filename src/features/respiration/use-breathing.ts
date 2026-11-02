import { useCallback, useEffect, useState } from "react";

export type BreathPhase = "inhale" | "hold" | "exhale";

/** Inspirer 4 secondes, garder 1 seconde, expirer 6 secondes : comme l'audio guidé. */
const STEPS: { phase: BreathPhase; seconds: number }[] = [
  { phase: "inhale", seconds: 4 },
  { phase: "hold", seconds: 1 },
  { phase: "exhale", seconds: 6 },
];

export const CYCLE_SECONDS = STEPS.reduce((sum, step) => sum + step.seconds, 0);

/** Phase et secondes restantes pour un temps écoulé donné. */
export function phaseAt(elapsed: number): { phase: BreathPhase; remaining: number } {
  const inCycle = elapsed % CYCLE_SECONDS;
  let offset = 0;
  for (const step of STEPS) {
    if (inCycle < offset + step.seconds) {
      return { phase: step.phase, remaining: offset + step.seconds - inCycle };
    }
    offset += step.seconds;
  }
  return { phase: "inhale", remaining: STEPS[0].seconds };
}

export function useBreathing(totalSeconds: number) {
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "running" && elapsed >= totalSeconds) setStatus("done");
  }, [elapsed, status, totalSeconds]);

  const start = useCallback(() => {
    setElapsed(0);
    setStatus("running");
  }, []);

  const stop = useCallback(() => {
    setStatus("idle");
    setElapsed(0);
  }, []);

  const current = status === "running" ? phaseAt(elapsed) : null;

  return {
    status,
    phase: current?.phase ?? null,
    remaining: current?.remaining ?? 0,
    cycles: Math.floor(elapsed / CYCLE_SECONDS),
    progress: totalSeconds > 0 ? Math.min(1, elapsed / totalSeconds) : 0,
    start,
    stop,
  };
}