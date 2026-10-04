// Génère des sons de remplacement (WAV mono) pour la démonstration.
// Usage : node scripts/make-placeholder-audio.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SAMPLE_RATE = 16000;
const OUT = new URL("../assets/audio/", import.meta.url);
mkdirSync(OUT, { recursive: true });

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((sample, i) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    data.writeInt16LE(Math.round(clamped * 32767), i * 2);
  });
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const tone = (seconds, fn) =>
  Array.from({ length: Math.floor(seconds * SAMPLE_RATE) }, (_, i) => fn(i / SAMPLE_RATE));

// do, ré, mi, sol, la
const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0];

const melody = (seconds) =>
  tone(seconds, (t) => {
    const note = NOTES[Math.floor(t) % NOTES.length];
    const phase = t % 1;
    const envelope = Math.min(1, phase * 8) * Math.exp(-2.2 * phase);
    return 0.28 * envelope * Math.sin(2 * Math.PI * note * t);
  });

// inspirer 4 s, expirer 6 s
const breathing = (seconds) =>
  tone(seconds, (t) => {
    const c = t % 10;
    const swell = c < 4 ? c / 4 : 1 - (c - 4) / 6;
    return (
      swell * (0.22 * Math.sin(2 * Math.PI * 196 * t) + 0.08 * Math.sin(2 * Math.PI * 294 * t))
    );
  });

const FILES = {
  "signes_fr_demo.wav": melody(14),
  "geste_fr_demo.wav": melody(16),
  "depistage_fr_demo.wav": melody(10),
  "soutien_fr_demo.wav": melody(12),
  "respiration_fr_demo.wav": breathing(24),
  "mythes_fr_demo.wav": melody(10),
};

for (const [name, samples] of Object.entries(FILES)) {
  writeFileSync(new URL(name, OUT), wav(samples));
  console.log("créé :", name);
}