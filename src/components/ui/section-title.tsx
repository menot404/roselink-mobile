import { Text } from "react-native";

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      accessibilityRole="header"
      className="font-jakarta-bold text-lg text-ink dark:text-ink-dark"
    >
      {children}
    </Text>
  );
}