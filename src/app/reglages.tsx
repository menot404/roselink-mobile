import { Text } from "react-native";

import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Screen } from "@/components/ui/screen";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function Reglages() {
  return (
    <Screen padTop={false}>
      <Card className="gap-3">
        <Text className="font-jakarta-semibold text-lg text-ink dark:text-ink-dark">
          Thème de l'application
        </Text>
        <ThemeSwitcher />
      </Card>
      <Disclaimer />
    </Screen>
  );
}