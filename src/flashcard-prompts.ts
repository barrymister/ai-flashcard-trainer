// Flashcard Prompt Templates — per deck type
// Pure functions, no DB imports

export type PromptStyle =
  | "rephrase"
  | "follow-up"
  | "real-world"
  | "relate"
  | "sentence"
  | "simplify";

export interface PromptTemplate {
  label: string;
  style: PromptStyle;
  buildPrompt: (front: string, back: string) => string;
}

const RESUME_PROMPTS: PromptTemplate[] = [
  {
    label: "Rephrase for non-technical manager",
    style: "rephrase",
    buildPrompt: (front, back) =>
      `I have this resume bullet point:\n\nQuestion: ${front}\nAnswer: ${back}\n\nRephrase the answer as if explaining to a non-technical hiring manager. Use plain language, no jargon. Keep it under 3 sentences.`,
  },
  {
    label: "Likely follow-up questions",
    style: "follow-up",
    buildPrompt: (front, back) =>
      `Given this interview Q&A:\n\nQ: ${front}\nA: ${back}\n\nWhat are the 3 most likely follow-up questions an interviewer would ask? For each, give a brief suggested answer.`,
  },
  {
    label: "Simplify for elevator pitch",
    style: "simplify",
    buildPrompt: (front, back) =>
      `Resume point:\n\nQ: ${front}\nA: ${back}\n\nCondense this into one compelling sentence suitable for an elevator pitch. Focus on impact, not implementation.`,
  },
];

const CERT_PROMPTS: PromptTemplate[] = [
  {
    label: "Explain with real-world example",
    style: "real-world",
    buildPrompt: (front, back) =>
      `Technical concept:\n\nQ: ${front}\nA: ${back}\n\nExplain this with a concrete real-world example from production AI/ML systems. Keep it practical and memorable.`,
  },
  {
    label: "Relate to production AI systems",
    style: "relate",
    buildPrompt: (front, back) =>
      `Study card:\n\nQ: ${front}\nA: ${back}\n\nHow does this concept apply when building and deploying AI systems in production? Give a specific scenario.`,
  },
  {
    label: "Simplify the explanation",
    style: "simplify",
    buildPrompt: (front, back) =>
      `Technical concept:\n\nQ: ${front}\nA: ${back}\n\nExplain this like I'm smart but new to the topic. Use an analogy if it helps. Keep it under 4 sentences.`,
  },
];

const VOCAB_PROMPTS: PromptTemplate[] = [
  {
    label: "Use in a sentence",
    style: "sentence",
    buildPrompt: (front, back) =>
      `Term: ${front}\nDefinition: ${back}\n\nUse this term naturally in 3 different sentences about AI engineering work. Each sentence should show a different aspect of the term's meaning.`,
  },
  {
    label: "Simplify the definition",
    style: "simplify",
    buildPrompt: (front, back) =>
      `Term: ${front}\nDefinition: ${back}\n\nGive me a simpler, more memorable definition in one sentence. Then give a quick "think of it like..." analogy.`,
  },
];

const SYSTEM_DESIGN_PROMPTS: PromptTemplate[] = [
  {
    label: "Walk through the design",
    style: "real-world",
    buildPrompt: (front, back) =>
      `System design question:\n\nQ: ${front}\nA: ${back}\n\nWalk through this design step by step as if explaining in an interview. Include: requirements, high-level architecture, key components, and trade-offs. Keep it conversational.`,
  },
  {
    label: "What could go wrong?",
    style: "follow-up",
    buildPrompt: (front, back) =>
      `System design:\n\nQ: ${front}\nA: ${back}\n\nWhat are the top 3 things that could go wrong with this design in production? For each, suggest a mitigation.`,
  },
];

const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    label: "Explain another way",
    style: "rephrase",
    buildPrompt: (front, back) =>
      `Flashcard:\n\nQ: ${front}\nA: ${back}\n\nExplain the answer in a completely different way. Use simpler language and a concrete example.`,
  },
  {
    label: "Why does this matter?",
    style: "relate",
    buildPrompt: (front, back) =>
      `Flashcard:\n\nQ: ${front}\nA: ${back}\n\nWhy is this important to know? Give a practical reason someone would need to understand this.`,
  },
];

const PROMPTS_BY_DECK_TYPE: Record<string, PromptTemplate[]> = {
  resume: RESUME_PROMPTS,
  cert: CERT_PROMPTS,
  vocab: VOCAB_PROMPTS,
  "system-design": SYSTEM_DESIGN_PROMPTS,
  custom: DEFAULT_PROMPTS,
};

/**
 * Get available prompt templates for a deck type.
 */
export function getPromptTemplates(deckType: string): PromptTemplate[] {
  return PROMPTS_BY_DECK_TYPE[deckType] ?? DEFAULT_PROMPTS;
}

/**
 * Build a prompt for AI explanation given a card and selected style.
 */
export function buildExplainPrompt(
  deckType: string,
  front: string,
  back: string,
  style: PromptStyle
): string {
  const templates = getPromptTemplates(deckType);
  const template = templates.find((t) => t.style === style) ?? templates[0];
  return template.buildPrompt(front, back);
}
