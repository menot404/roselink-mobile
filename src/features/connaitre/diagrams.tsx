import Svg, { Circle, Line, Path } from "react-native-svg";

import { useAppTheme } from "@/context/theme-context";

type Pose = "down" | "up" | "hips";

/** Silhouette simplifiée vue de face, avec trois positions de bras. Illustration provisoire. */
export function PoseDiagram({ pose }: { pose: Pose }) {
  const { colors } = useAppTheme();
  const body = colors.inkSoft;

  const arms: Record<Pose, { left: string; right: string }> = {
    down: { left: "M62 82 L46 160", right: "M138 82 L154 160" },
    up: { left: "M62 82 L50 22", right: "M138 82 L150 22" },
    hips: { left: "M62 82 L38 122 L68 152", right: "M138 82 L162 122 L132 152" },
  };

  return (
    <Svg width={200} height={220} viewBox="0 0 200 220" accessibilityLabel="Silhouette vue de face">
      <Circle cx={100} cy={32} r={20} fill="none" stroke={body} strokeWidth={4} />
      <Line x1={100} y1={52} x2={100} y2={68} stroke={body} strokeWidth={4} strokeLinecap="round" />
      <Path
        d="M62 80 Q100 66 138 80 L130 176 Q100 186 70 176 Z"
        fill="none"
        stroke={body}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path d={arms[pose].left} fill="none" stroke={body} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <Path d={arms[pose].right} fill="none" stroke={body} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={82} cy={114} r={17} fill={colors.primarySoft} stroke={colors.primary} strokeWidth={3} />
      <Circle cx={118} cy={114} r={17} fill={colors.primarySoft} stroke={colors.primary} strokeWidth={3} />
      <Circle cx={82} cy={114} r={3.5} fill={colors.primary} />
      <Circle cx={118} cy={114} r={3.5} fill={colors.primary} />
    </Svg>
  );
}

function spiralPath(cx: number, cy: number, from: number, to: number, turns: number) {
  const steps = 90;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const radius = from + (to - from) * t;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Sein vu de face : on part du mamelon et on tourne vers l'extérieur, jusqu'à l'aisselle. */
export function PalpationDiagram() {
  const { colors } = useAppTheme();

  return (
    <Svg width={220} height={220} viewBox="0 0 220 220" accessibilityLabel="Schéma de la palpation en spirale">
      {/* prolongement vers l'aisselle */}
      <Path
        d="M168 52 Q204 42 206 96 Q196 112 176 108"
        fill={colors.primarySoft}
        stroke={colors.inkSoft}
        strokeWidth={3}
        opacity={0.7}
      />
      <Circle cx={105} cy={112} r={82} fill="none" stroke={colors.inkSoft} strokeWidth={4} />
      <Circle cx={105} cy={112} r={20} fill={colors.primarySoft} stroke={colors.inkSoft} strokeWidth={3} />
      <Path
        d={spiralPath(105, 112, 10, 70, 3)}
        fill="none"
        stroke={colors.primary}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={105} cy={112} r={5} fill={colors.primary} />
    </Svg>
  );
}
