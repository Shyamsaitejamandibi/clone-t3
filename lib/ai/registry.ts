import { createProviderRegistry, customProvider } from "ai";
import { gateway } from "@ai-sdk/gateway";

export const registry = createProviderRegistry(
  {
    openai: customProvider({
      languageModels: {
        "gpt-4o": gateway("openai/gpt-4o"),
        "gpt-4o-mini": gateway("openai/gpt-4o-mini"),
        "gpt-4.1-nano": gateway("openai/gpt-4.1-nano"),
      },
    }),
    anthropic: customProvider({
      languageModels: {
        "claude-sonnet-4": gateway("anthropic/claude-sonnet-4"),
        "claude-3.7-sonnet": gateway("anthropic/claude-3.7-sonnet"),
      },
    }),
    google: customProvider({
      languageModels: {
        "gemini-2.0-flash": gateway("google/gemini-2.0-flash"),
      },
    }),
    deepseek: customProvider({
      languageModels: {
        "deepseek-r1": gateway("deepseek/deepseek-r1"),
      },
    }),
  },
  {
    separator: "/",
  }
);
export const DEFAULT_MODEL = "openai/gpt-4.1-nano";
