export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export const getDefaultModels = (): ModelInfo[] => [
  // OpenAI Models
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    context_length: 128000,
    pricing: { prompt: "0.005", completion: "0.015" },
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    context_length: 128000,
    pricing: { prompt: "0.00015", completion: "0.0006" },
  },
  {
    id: "openai/gpt-4.1-nano",
    name: "GPT-4.1 Nano",
    provider: "OpenAI",
    context_length: 128000,
    pricing: { prompt: "0.001", completion: "0.003" },
  },

  // Anthropic Models
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude 4 Sonnet (Reasoning)",
    provider: "Anthropic",
    context_length: 200000,
    pricing: { prompt: "0.003", completion: "0.015" },
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet (Reasoning)",
    provider: "Anthropic",
    context_length: 200000,
    pricing: { prompt: "0.003", completion: "0.015" },
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    context_length: 128000,
    pricing: { prompt: "0.0015", completion: "0.006" },
  },
  {
    id: "deepseek/deepseek-r1",
    name: "Deepseek R1",
    provider: "Deepseek",
    context_length: 65536,
    pricing: { prompt: "0.002", completion: "0.008" },
  },
];
