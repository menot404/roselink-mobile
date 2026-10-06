import "../tailwind.css";

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { AppThemeProvider, useAppTheme } from "@/context/theme-context";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { scheme, colors } = useAppTheme();
  const { ready, isSignedIn } = useAuth();

  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.canvas,
      card: colors.surface,
      text: colors.ink,
      border: colors.border,
    },
  };

  if (!ready) return null;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "PlusJakartaSans_700Bold" },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="connexion" options={{ headerShown: true, title: "Connexion" }} />
          <Stack.Screen name="inscription" options={{ headerShown: true, title: "Créer mon compte" }} />
        </Stack.Protected>

        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profil" options={{ headerShown: true, title: "Mon profil" }} />
          <Stack.Screen name="signes" options={{ headerShown: true, title: "Signes d'alerte" }} />
          <Stack.Screen name="connaitre" options={{ headerShown: true, title: "Connaître ses seins" }} />
          <Stack.Screen name="mythes" options={{ headerShown: true, title: "Mythes ou réalités" }} />
          <Stack.Screen name="audio" options={{ headerShown: true, title: "Conseils en audio" }} />
          <Stack.Screen name="don" options={{ headerShown: true, title: "Faire un don" }} />
          <Stack.Screen name="aide" options={{ headerShown: true, title: "Aide et solidarité" }} />
          <Stack.Screen name="humeur" options={{ headerShown: true, title: "Journal d'humeur" }} />
          <Stack.Screen name="respiration" options={{ headerShown: true, title: "Respiration" }} />
          <Stack.Screen name="histoires" options={{ headerShown: true, title: "Histoires de femmes" }} />
          <Stack.Screen name="reconstruction" options={{ headerShown: true, title: "Reconstruction" }} />
        </Stack.Protected>
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AppThemeProvider>
  );
}