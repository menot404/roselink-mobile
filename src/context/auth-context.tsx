import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { Account } from "@/types/account";

type SignInResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  ready: boolean;
  onboarded: boolean;
  isSignedIn: boolean;
  user: Account | null;
  completeOnboarding: () => Promise<void>;
  signUp: (account: Account) => Promise<void>;
  signIn: (identifier: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  updateAccount: (changes: Partial<Account>) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const ACCOUNT_KEY = "roselink.account";
const SESSION_KEY = "roselink.session";
const ONBOARDED_KEY = "roselink.onboarded";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [rawAccount, session, seen] = await Promise.all([
          AsyncStorage.getItem(ACCOUNT_KEY),
          AsyncStorage.getItem(SESSION_KEY),
          AsyncStorage.getItem(ONBOARDED_KEY),
        ]);
        if (rawAccount) {
          setAccount(JSON.parse(rawAccount) as Account);
          setSignedIn(session === "1");
        }
        setOnboarded(seen === "1");
      } catch {
        // stockage indisponible : on repart d'un état vide
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const completeOnboarding = async () => {
    setOnboarded(true);
    try {
      await AsyncStorage.setItem(ONBOARDED_KEY, "1");
    } catch { }
  };

  const signUp = async (next: Account) => {
    setAccount(next);
    setSignedIn(true);
    setOnboarded(true);
    try {
      await AsyncStorage.multiSet([
        [ACCOUNT_KEY, JSON.stringify(next)],
        [SESSION_KEY, "1"],
        [ONBOARDED_KEY, "1"],
      ]);
    } catch { }
  };

  const signIn = async (identifier: string): Promise<SignInResult> => {
    const wanted = identifier.trim().toLowerCase();
    if (!account || account.identifier.toLowerCase() !== wanted) {
      return { ok: false, error: "Aucun compte trouvé sur ce téléphone. Inscris-toi d'abord." };
    }
    setSignedIn(true);
    try {
      await AsyncStorage.setItem(SESSION_KEY, "1");
    } catch { }
    return { ok: true };
  };

  const signOut = async () => {
    setSignedIn(false);
    try {
      await AsyncStorage.setItem(SESSION_KEY, "0");
    } catch { }
  };

  const updateAccount = async (changes: Partial<Account>) => {
    if (!account) return;
    const next = { ...account, ...changes };
    setAccount(next);
    try {
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
    } catch { }
  };

  const deleteAccount = async () => {
    setAccount(null);
    setSignedIn(false);
    try {
      await AsyncStorage.multiRemove([
        ACCOUNT_KEY,
        SESSION_KEY,
        "roselink.selfexam.last",
        "roselink.mood.entries",
      ]);
    } catch { }
  };

  const value: AuthContextValue = {
    ready,
    onboarded,
    isSignedIn: signedIn && account !== null,
    user: signedIn ? account : null,
    completeOnboarding,
    signUp,
    signIn,
    signOut,
    updateAccount,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}