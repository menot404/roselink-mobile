import * as Crypto from "expo-crypto";

export function randomSalt(): string {
  const bytes = Crypto.getRandomBytes(16);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Le code n'est jamais enregistré en clair : seulement son empreinte avec un sel. */
export function hashPin(salt: string, pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}