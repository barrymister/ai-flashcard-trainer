// ai-flashcard-trainer — React components + types
// Import: import { StudySession, FlashcardCard, DeckSelector } from "ai-flashcard-trainer"

export { FlashcardCard } from "./components/FlashcardCard";
export { DeckSelector } from "./components/DeckSelector";
export { SessionSummary } from "./components/SessionSummary";
export { StudySession } from "./components/StudySession";
export { AiExplainPanel } from "./components/AiExplainPanel";
export type { AiExplainPanelProps, ExplainResult } from "./components/AiExplainPanel";

// Re-export all types for convenience
export type {
  DeckType,
  FlashcardDifficulty,
  ReviewRating,
  FlashcardDeck,
  Flashcard,
  FlashcardReview,
  FlashcardWithReview,
  StudySession as StudySessionType,
  StudySessionStats,
  SessionCompletePayload,
  StudySessionCallbacks,
  DeckInfo,
} from "./types";

// Re-export engine functions (available without React via ./engine)
export {
  calculateNextReview,
  isDue,
  sortByPriority,
} from "./spaced-repetition";

export {
  getPromptTemplates,
  buildExplainPrompt,
} from "./flashcard-prompts";

export type { Rating, ReviewResult } from "./spaced-repetition";
export type { PromptStyle, PromptTemplate } from "./flashcard-prompts";
