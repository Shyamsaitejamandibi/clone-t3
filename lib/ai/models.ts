import { createProviderRegistry } from "ai";
import { gateway } from "@ai-sdk/gateway";

export const customSeparatorRegistry = createProviderRegistry(
  {
    gateway,
  },
  { separator: " > " }
);
export const DEFAULT_MODEL = "gpt-4.1-nano";
