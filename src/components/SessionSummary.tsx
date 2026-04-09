"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface SessionSummaryProps {
  cardsReviewed: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  durationSeconds: number;
  onRestart: () => void;
  onBack: () => void;
}

export function SessionSummary({
  cardsReviewed,
  easyCount,
  mediumCount,
  hardCount,
  durationSeconds,
  onRestart,
  onBack,
}: SessionSummaryProps) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const accuracy =
    cardsReviewed > 0
      ? Math.round(((easyCount + mediumCount) / cardsReviewed) * 100)
      : 0;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Session Complete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold">{cardsReviewed}</p>
            <p className="text-xs text-muted-foreground">Cards Reviewed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {easyCount} easy
            </Badge>
            <Badge variant="outline" className="text-xs">
              {mediumCount} med
            </Badge>
            <Badge variant="destructive" className="text-xs">
              {hardCount} hard
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Back to Decks
          </Button>
          <Button className="flex-1" onClick={onRestart}>
            Study Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
