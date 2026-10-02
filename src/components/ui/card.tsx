import type { ReactNode } from "react";
import { View } from "react-native";

type Props = { children: ReactNode; className?: string };

export function Card({ children, className = "" }: Props) {
  return (
    <View
      className={`rounded-2xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark ${className}`}
    >
      {children}
    </View>
  );
}