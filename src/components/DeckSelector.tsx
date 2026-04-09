"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { DeckInfo } from "../types";

interface DeckSelectorProps {
  decks: DeckInfo[];
  onSelect: (deck: DeckInfo) => void;
  typeColors?: Record<string, string>;
}

const defaultTypeColors: Record<string, string> = {
  cert: "bg-blue-500/10 text-blue-500",
  resume: "bg-green-500/10 text-green-500",
  vocab: "bg-purple-500/10 text-purple-500",
  "system-design": "bg-orange-500/10 text-orange-500",
  custom: "bg-zinc-500/10 text-zinc-500",
};

export function DeckSelector({ decks, onSelect, typeColors }: DeckSelectorProps) {
  const colors = typeColors ?? defaultTypeColors;

  if (decks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>No decks available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Card
          key={deck.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onSelect(deck)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSelect(deck);
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{deck.name}</CardTitle>
              <Badge
                className={`text-xs ${colors[deck.deckType] || colors.custom || ""}`}
                variant="secondary"
              >
                {deck.deckType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {deck.description && (
              <p className="text-xs text-muted-foreground mb-2">
                {deck.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{deck.cardCount} cards</span>
              {deck.dueCount !== undefined && deck.dueCount > 0 && (
                <span className="text-orange-500">
                  {deck.dueCount} due
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
