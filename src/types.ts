// ai-flashcard-trainer — Type Definitions

export type DeckType = "cert" | "resume" | "vocab" | "system-design" | "custom";
export type FlashcardDifficulty = "easy" | "medium" | "hard";
export type ReviewRating = "easy" | "medium" | "hard";

export interface FlashcardDeck {
  id: string;
  name: string;
  slug: string;
  deckType: DeckType;
  description: string | null;
  promptTemplate: string | null;
  cardCount: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  difficulty: FlashcardDifficulty;
  tags: string[];
  sourceFile: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardReview {
  id: string;
  cardId: string;
  rating: ReviewRating;
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
  reviewedAt: Date;
}

export interface FlashcardWithReview extends Flashcard {
  lastReview: FlashcardReview | null;
  isDue: boolean;
}

export interface StudySession {
  id: string;
  deckId: string | null;
  cardsReviewed: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  durationSeconds: number | null;
  startedAt: Date;
  completedAt: Date | null;
}

export interface StudySessionStats {
  totalSessions: number;
  totalCardsReviewed: number;
  totalTimeSeconds: number;
  averageAccuracy: number;
  streakDays: number;
}

export interface SessionCompletePayload {
  cardsReviewed: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  durationSeconds: number;
  completedAt: string;
}

export interface StudySessionCallbacks {
  fetchDueCards: (deckId: string) => Promise<FlashcardWithReview[]>;
  startSession: (deckId: string) => Promise<{ id: string }>;
  submitReview: (cardId: string, rating: ReviewRating) => Promise<void>;
  completeSession: (sessionId: string, stats: SessionCompletePayload) => Promise<void>;
}

export interface DeckInfo {
  id: string;
  name: string;
  slug: string;
  deckType: string;
  description: string | null;
  cardCount: number;
  dueCount?: number;
}
