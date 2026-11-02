import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

import { describeBiometrics, type BiometricInfo } from "./biometric-labels";

/**
 * Sur Android, true n'accepte que les biométries de classe « forte » : plus sûr, mais certains
 * déverrouillages par visage, jugés moins fiables, sont alors refusés.
 */
const REQUIRE_STRONG_BIOMETRICS = false;

type Status = {
    /** La vérification du téléphone est terminée */
    checked: boolean;
    hasHardware: boolean;
    /** Au moins une empreinte ou un visage est enregistré dans le téléphone */
    enrolled: boolean;
    info: BiometricInfo;
};

export function useBiometrics() {
    const [status, setStatus] = useState<Status>({
        checked: false,
        hasHardware: false,
        enrolled: false,
        info: describeBiometrics([], Platform.OS),
    });

    const refresh = useCallback(async () => {
        try {
            const [hasHardware, enrolled, types] = await Promise.all([
                LocalAuthentication.hasHardwareAsync(),
                LocalAuthentication.isEnrolledAsync(),
                LocalAuthentication.supportedAuthenticationTypesAsync(),
            ]);
            setStatus({
                checked: true,
                hasHardware,
                enrolled,
                info: describeBiometrics(types, Platform.OS),
            });
        } catch {
            setStatus((previous) => ({ ...previous, checked: true }));
        }
    }, []);

    useEffect(() => {
        void refresh();
        // l'utilisateur peut enregistrer une empreinte dans les réglages puis revenir
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") void refresh();
        });
        return () => subscription.remove();
    }, [refresh]);

    /** Affiche la demande du système. Retourne true si la reconnaissance a réussi. */
    const authenticate = useCallback(async (promptMessage: string): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                cancelLabel: "Utiliser mon code",
                // le code de RoseLink sert de secours, pas celui du téléphone
                disableDeviceFallback: true,
                ...(REQUIRE_STRONG_BIOMETRICS ? { biometricsSecurityLevel: "strong" as const } : {}),
            });
            return result.success;
        } catch {
            return false;
        }
    }, []);

    return {
        ...status,
        /** Capteur présent ET au moins une empreinte ou un visage enregistré */
        available: status.hasHardware && status.enrolled,
        refresh,
        authenticate,
    };
}