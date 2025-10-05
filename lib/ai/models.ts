export interface ModelInfo {
  id: string;
  name: string;
}

export const getDefaultModels = (): ModelInfo[] => [
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
  },
  {
    id: "openai/gpt-4.1-nano",
    name: "GPT-4.1 Nano",
  },

  // Anthropic Models
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude 4 Sonnet (Reasoning)",
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet (Reasoning)",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
  },
  {
    id: "deepseek/deepseek-r1",
    name: "Deepseek R1",
  },
];
