import { Redirect } from "expo-router";

import { useAuth } from "@/context/auth-context";

export default function Index() {
  const { isSignedIn, onboarded } = useAuth();

  if (isSignedIn) return <Redirect href="/accueil" />;
  return <Redirect href={onboarded ? "/connexion" : "/onboarding"} />;
}