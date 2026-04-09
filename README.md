# ai-flashcard-trainer

React components and spaced repetition engine for flashcard-based training. Features study sessions with card flip animations, AI-powered alternative explanations, deck management, and SM-2 spaced repetition.

## Install

```bash
npm install ai-flashcard-trainer
```

## Usage

### React Components

```tsx
import { StudySession, DeckSelector } from "ai-flashcard-trainer";

// DeckSelector — pure presentation, pass decks + onSelect
<DeckSelector
  decks={decks}
  onSelect={(deck) => startStudying(deck)}
/>

// StudySession — pass callbacks for data operations
<StudySession
  deckId="abc-123"
  deckName="AWS ML Engineer"
  deckType="cert"
  onBack={() => setView("decks")}
  callbacks={{
    fetchDueCards: async (deckId) => fetch(`/api/cards?deckId=${deckId}&due=true`).then(r => r.json()),
    startSession: async (deckId) => fetch("/api/sessions", { method: "POST", body: JSON.stringify({ deckId }) }).then(r => r.json()),
    submitReview: async (cardId, rating) => { fetch(`/api/cards/${cardId}/review`, { method: "POST", body: JSON.stringify({ rating }) }) },
    completeSession: async (sessionId, stats) => { fetch(`/api/sessions/${sessionId}`, { method: "PATCH", body: JSON.stringify(stats) }) },
  }}
  onExplain={async ({ front, back, deckType, style }) => {
    const res = await fetch("/api/ai-explain", { method: "POST", body: JSON.stringify({ front, back, deckType, style }) });
    return res.json();
  }}
/>
```

### Engine (no React dependency)

```ts
import { calculateNextReview, isDue, getPromptTemplates } from "ai-flashcard-trainer/engine";

const result = calculateNextReview(currentInterval, easeFactor, "easy");
// { interval: 6, easeFactor: 2.65, nextReviewAt: Date }

const templates = getPromptTemplates("cert");
// [{ label: "Explain with real-world example", style: "real-world", buildPrompt: fn }, ...]
```

### Drizzle Schema (optional)

```ts
import { flashcardDecks, flashcards, flashcardReviews, studySessions } from "ai-flashcard-trainer/schema";
```

## Components

| Component | Description |
|---|---|
| `StudySession` | Full study flow: card loading, flip, rating, progress, session tracking |
| `FlashcardCard` | Single card with CSS 3D flip animation |
| `AiExplainPanel` | AI-powered alternative explanations with prompt style buttons |
| `DeckSelector` | Grid of deck cards with type badges and due counts |
| `SessionSummary` | End-of-session stats with restart/back actions |

## Spaced Repetition

Uses a simplified SM-2 algorithm:
- **Easy**: interval grows faster, ease factor increases
- **Medium**: interval grows at current rate
- **Hard**: interval resets to 1 day, ease factor decreases
- Max interval: 180 days

## License

MIT
