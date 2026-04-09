"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FlashcardCard } from "./FlashcardCard";
import { AiExplainPanel } from "./AiExplainPanel";
import { SessionSummary } from "./SessionSummary";
import type {
  FlashcardWithReview,
  ReviewRating,
  StudySessionCallbacks,
} from "../types";
import type { PromptStyle } from "../flashcard-prompts";

interface StudySessionProps {
  deckId: string;
  deckName: string;
  deckType: string;
  onBack: () => void;
  callbacks: StudySessionCallbacks;
  /** Optional custom AI explain panel. If not provided, the default is used (requires onExplain in callbacks). */
  renderExplainPanel?: (props: {
    front: string;
    back: string;
    deckType: string;
  }) => ReactNode;
  /** Default onExplain handler for the built-in AiExplainPanel. Required if renderExplainPanel is not provided. */
  onExplain?: (params: {
    front: string;
    back: string;
    deckType: string;
    style: PromptStyle;
  }) => Promise<{ explanation: string; latencyMs?: number }>;
}

export function StudySession({
  deckId,
  deckName,
  deckType,
  onBack,
  callbacks,
  renderExplainPanel,
  onExplain,
}: StudySessionProps) {
  const [cards, setCards] = useState<FlashcardWithReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [completed, setCompleted] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      const data = await callbacks.fetchDueCards(deckId);
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  }, [deckId, callbacks]);

  const startSession = useCallback(async () => {
    try {
      const data = await callbacks.startSession(deckId);
      setSessionId(data.id);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }, [deckId, callbacks]);

  useEffect(() => {
    fetchCards();
    startSession();
  }, [fetchCards, startSession]);

  const currentCard = cards[currentIndex];
  const totalReviewed = stats.easy + stats.medium + stats.hard;

  async function handleRate(rating: ReviewRating) {
    if (!currentCard) return;

    callbacks.submitReview(currentCard.id, rating).catch(console.error);

    const newStats = { ...stats, [rating]: stats[rating] + 1 };
    setStats(newStats);

    if (currentIndex + 1 >= cards.length) {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      if (sessionId) {
        callbacks
          .completeSession(sessionId, {
            cardsReviewed: totalReviewed + 1,
            easyCount: newStats.easy,
            mediumCount: newStats.medium,
            hardCount: newStats.hard,
            durationSeconds,
            completedAt: new Date().toISOString(),
          })
          .catch(console.error);
      }
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setFlipped(false);
    setStats({ easy: 0, medium: 0, hard: 0 });
    setCompleted(false);
    setLoading(true);
    fetchCards();
    startSession();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading cards...
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-muted-foreground">
          No cards due for review in this deck.
        </p>
        <Button variant="outline" onClick={onBack}>
          Back to Decks
        </Button>
      </div>
    );
  }

  if (completed) {
    return (
      <SessionSummary
        cardsReviewed={totalReviewed}
        easyCount={stats.easy}
        mediumCount={stats.medium}
        hardCount={stats.hard}
        durationSeconds={Math.round((Date.now() - startTime) / 1000)}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          {deckName}
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1} / {cards.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {stats.easy}E {stats.medium}M {stats.hard}H
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-primary transition-all"
          style={{
            width: `${(currentIndex / cards.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      <FlashcardCard
        front={currentCard.front}
        back={currentCard.back}
        difficulty={currentCard.difficulty}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />

      {/* Rating buttons */}
      {flipped && (
        <div className="flex justify-center gap-3">
          <Button
            variant="destructive"
            onClick={() => handleRate("hard")}
            className="flex-1 max-w-[140px]"
          >
            Hard
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate("medium")}
            className="flex-1 max-w-[140px]"
          >
            Medium
          </Button>
          <Button
            variant="default"
            onClick={() => handleRate("easy")}
            className="flex-1 max-w-[140px]"
          >
            Easy
          </Button>
        </div>
      )}

      {/* AI Explain */}
      {flipped &&
        (renderExplainPanel ? (
          renderExplainPanel({
            front: currentCard.front,
            back: currentCard.back,
            deckType,
          })
        ) : onExplain ? (
          <AiExplainPanel
            front={currentCard.front}
            back={currentCard.back}
            deckType={deckType}
            onExplain={onExplain}
          />
        ) : null)}
    </div>
  );
}
