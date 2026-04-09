"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getPromptTemplates } from "../flashcard-prompts";
import type { PromptStyle } from "../flashcard-prompts";

export interface ExplainResult {
  explanation: string;
  latencyMs?: number;
}

export interface AiExplainPanelProps {
  front: string;
  back: string;
  deckType: string;
  onExplain: (params: {
    front: string;
    back: string;
    deckType: string;
    style: PromptStyle;
  }) => Promise<ExplainResult>;
}

export function AiExplainPanel({
  front,
  back,
  deckType,
  onExplain,
}: AiExplainPanelProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const templates = getPromptTemplates(deckType);

  async function handleExplain(style: PromptStyle) {
    setLoading(true);
    setActiveStyle(style);
    setExplanation(null);
    setLatencyMs(null);

    try {
      const result = await onExplain({ front, back, deckType, style });
      setExplanation(result.explanation);
      setLatencyMs(result.latencyMs ?? null);
    } catch {
      setExplanation("Failed to generate explanation. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">AI Explain</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <Button
              key={t.style}
              variant={activeStyle === t.style ? "default" : "outline"}
              size="sm"
              disabled={loading}
              onClick={() => handleExplain(t.style)}
            >
              {loading && activeStyle === t.style ? "..." : t.label}
            </Button>
          ))}
        </div>

        {explanation && (
          <div className="rounded-md bg-muted p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {explanation}
            {latencyMs && (
              <p className="text-xs text-muted-foreground mt-2">
                Generated in {(latencyMs / 1000).toFixed(1)}s
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
