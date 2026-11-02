/** Valeurs de AuthenticationType dans expo-local-authentication */
const FINGERPRINT = 1;
const FACE = 2;
const IRIS = 3;

export type BiometricIcon = "fingerprint" | "face";

export type BiometricInfo = {
  /** Se lit après « avec » : « avec Face ID », « avec l'empreinte digitale » */
  name: string;
  icon: BiometricIcon;
};

/**
 * Nom du déverrouillage biométrique à afficher, d'après ce que le téléphone déclare.
 * Sur iPhone, la réponse est précise (Face ID ou Touch ID). Sur Android, le système ne déclare
 * pas toujours tous les capteurs : le texte reste volontairement simple.
 */
export function describeBiometrics(types: readonly number[], os: string): BiometricInfo {
  const hasFingerprint = types.includes(FINGERPRINT);
  const hasFace = types.includes(FACE);
  const hasIris = types.includes(IRIS);

  if (os === "ios") {
    if (hasFace) return { name: "Face ID", icon: "face" };
    if (hasFingerprint) return { name: "Touch ID", icon: "fingerprint" };
  }

  if (hasFingerprint && hasFace) {
    return { name: "l'empreinte digitale ou la reconnaissance faciale", icon: "fingerprint" };
  }
  if (hasFace) return { name: "la reconnaissance faciale", icon: "face" };
  if (hasFingerprint) return { name: "l'empreinte digitale", icon: "fingerprint" };
  if (hasIris) return { name: "la reconnaissance de l'iris", icon: "face" };
  return { name: "la biométrie du téléphone", icon: "fingerprint" };
}