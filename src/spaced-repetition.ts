// Spaced Repetition Engine — Simplified SM-2 Algorithm
// Pure functions, no DB imports

export type Rating = "easy" | "medium" | "hard";

export interface ReviewResult {
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
}

/**
 * Calculate the next review interval using a simplified SM-2 algorithm.
 */
export function calculateNextReview(
  currentInterval: number,
  currentEaseFactor: number,
  rating: Rating
): ReviewResult {
  let interval: number;
  let easeFactor = currentEaseFactor;

  switch (rating) {
    case "easy":
      easeFactor = Math.min(easeFactor + 0.15, 3.0);
      break;
    case "medium":
      break;
    case "hard":
      easeFactor = Math.max(easeFactor - 0.2, 1.3);
      break;
  }

  if (rating === "hard") {
    interval = 1;
  } else if (currentInterval === 0) {
    interval = rating === "easy" ? 4 : 1;
  } else if (currentInterval === 1) {
    interval = rating === "easy" ? 6 : 3;
  } else {
    interval = Math.round(currentInterval * easeFactor);
  }

  interval = Math.min(interval, 180);

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { interval, easeFactor, nextReviewAt };
}

/**
 * Check if a card is due for review.
 */
export function isDue(nextReviewAt: Date | null): boolean {
  if (!nextReviewAt) return true;
  return new Date() >= nextReviewAt;
}

/**
 * Sort cards by review priority: due cards first (oldest first), then by difficulty.
 */
export function sortByPriority<
  T extends { nextReviewAt: Date | null; difficulty: string }
>(cards: T[]): T[] {
  return [...cards].sort((a, b) => {
    const aDue = isDue(a.nextReviewAt);
    const bDue = isDue(b.nextReviewAt);

    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    if (aDue && bDue) {
      const aTime = a.nextReviewAt?.getTime() ?? 0;
      const bTime = b.nextReviewAt?.getTime() ?? 0;
      return aTime - bTime;
    }

    const diffOrder: Record<string, number> = { hard: 0, medium: 1, easy: 2 };
    return (diffOrder[a.difficulty] ?? 1) - (diffOrder[b.difficulty] ?? 1);
  });
}
