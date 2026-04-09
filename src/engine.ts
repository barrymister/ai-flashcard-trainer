// Engine — backend-safe exports (no React dependency)
// Import: import { calculateNextReview, getPromptTemplates } from "ai-flashcard-trainer/engine"

export {
  calculateNextReview,
  isDue,
  sortByPriority,
  type Rating,
  type ReviewResult,
} from "./spaced-repetition";

export {
  getPromptTemplates,
  buildExplainPrompt,
  type PromptStyle,
  type PromptTemplate,
} from "./flashcard-prompts";

export type {
  DeckType,
  FlashcardDifficulty,
  ReviewRating,
  FlashcardDeck,
  Flashcard,
  FlashcardReview,
  FlashcardWithReview,
  StudySession,
  StudySessionStats,
  SessionCompletePayload,
  StudySessionCallbacks,
  DeckInfo,
} from "./types";
