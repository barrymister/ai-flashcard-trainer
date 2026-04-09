// Optional Drizzle schema for flashcard tables
// Import: import { flashcardDecks, flashcards } from "ai-flashcard-trainer/schema"
// Requires drizzle-orm as a peer dependency

import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

export const flashcardDecks = pgTable("flashcard_decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  deckType: text("deck_type").notNull().default("custom"),
  description: text("description"),
  promptTemplate: text("prompt_template"),
  cardCount: integer("card_count").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id")
    .references(() => flashcardDecks.id)
    .notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  tags: jsonb("tags").notNull().default([]),
  sourceFile: text("source_file"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flashcardReviews = pgTable("flashcard_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  cardId: uuid("card_id")
    .references(() => flashcards.id)
    .notNull(),
  rating: text("rating").notNull(),
  interval: integer("interval").notNull().default(1),
  easeFactor: real("ease_factor").notNull().default(2.5),
  nextReviewAt: timestamp("next_review_at").notNull(),
  reviewedAt: timestamp("reviewed_at").defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id").references(() => flashcardDecks.id),
  cardsReviewed: integer("cards_reviewed").notNull().default(0),
  easyCount: integer("easy_count").notNull().default(0),
  mediumCount: integer("medium_count").notNull().default(0),
  hardCount: integer("hard_count").notNull().default(0),
  durationSeconds: integer("duration_seconds"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
