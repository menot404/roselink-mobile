export type MoodId = "serene" | "fine" | "tired" | "anxious" | "sad" | "angry";

export type Mood = {
  id: MoodId;
  label: string;
  /** Couleur en thème clair et sombre (toujours accompagnée d'une icône et d'un texte) */
  light: string;
  dark: string;
  /** Humeur difficile : sert à proposer un soutien doux, jamais à poser un diagnostic */
  hard: boolean;
};

export type MoodEntry = { id: string; date: string; mood: MoodId; note: string };

export const MOODS: Mood[] = [
  { id: "serene", label: "Sereine", light: "#2E8B57", dark: "#5FCB8C", hard: false },
  { id: "fine", label: "Ça va", light: "#0F8B8D", dark: "#4FD1D3", hard: false },
  { id: "tired", label: "Fatiguée", light: "#7A5C99", dark: "#B79AD6", hard: false },
  { id: "anxious", label: "Inquiète", light: "#C2410C", dark: "#FB923C", hard: true },
  { id: "sad", label: "Triste", light: "#3B6FB6", dark: "#7FA8E6", hard: true },
  { id: "angry", label: "En colère", light: "#B91C1C", dark: "#F87171", hard: true },
];

export const moodById = (id: MoodId): Mood => MOODS.find((mood) => mood.id === id) ?? MOODS[1];