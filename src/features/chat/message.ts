import type { ChatAction, SourceId } from "./knowledge/types";

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      actions: ChatAction[];
      sourceIds: SourceId[];
      needsReview: boolean;
    };

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
