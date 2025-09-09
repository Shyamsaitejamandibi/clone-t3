import { createProviderRegistry, customProvider } from "ai";
import { gateway } from "@ai-sdk/gateway";

export const registry = createProviderRegistry({
  openai: customProvider({
    languageModels: {
      "openai/gpt-4.1-nano": gateway("openai/gpt-4.1-nano"),
    },
  }),
});
export const DEFAULT_MODEL = "gpt-4.1-nano";
