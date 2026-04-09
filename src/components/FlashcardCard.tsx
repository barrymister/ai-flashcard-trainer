"use client";

import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

interface FlashcardCardProps {
  front: string;
  back: string;
  difficulty: string;
  flipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({
  front,
  back,
  difficulty,
  flipped,
  onFlip,
}: FlashcardCardProps) {
  return (
    <div
      className="perspective-1000 cursor-pointer select-none"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") onFlip();
      }}
    >
      <div
        className={cn(
          "relative w-full min-h-[280px] transition-transform duration-500",
          "[transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <Card className="absolute inset-0 [backface-visibility:hidden]">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] p-6 text-center">
            <Badge variant="secondary" className="mb-4 text-xs">
              {difficulty}
            </Badge>
            <p className="text-lg font-medium leading-relaxed">{front}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Click to reveal answer
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] p-6 text-center">
            <Badge variant="outline" className="mb-4 text-xs">
              Answer
            </Badge>
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {back}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
