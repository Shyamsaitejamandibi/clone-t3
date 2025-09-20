import { z } from "zod";
import type { UIMessage } from "ai";

export const messageMetadataSchema = z.object({
  modelId: z.string().optional(),
  tokenUsage: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatMessage = UIMessage<MessageMetadata>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
