import { gateway } from "@ai-sdk/gateway";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  UIMessage,
} from "ai";
import { httpAction } from "./_generated/server";
import { generateUUID } from "@/lib/utils";
import { api, internal } from "./_generated/api";
import { registry } from "@/lib/ai/registry";
import { ModelInfo } from "@/lib/ai/models";

export const streamChat = httpAction(async (ctx, req) => {
  const data = await req.json();
  const {
    messages,
    id,
    selectedChatModel,
    userId,
  }: {
    messages: UIMessage[];
    id: string;
    selectedChatModel: ModelInfo["id"];
    userId: string;
  } = data;
  console.log("Received data:", data);
  console.log("User ID in streamChat:", userId);
  const chatId = await ctx.runQuery(api.threads.getChatId, {
    id,
    userId,
  });
  await ctx.runMutation(internal.threads.createThread, {
    role: "user",
    parts: messages[messages.length - 1].parts
      .filter((part) => part.type === "text" || part.type === "reasoning")
      .map((part) => ({
        type: part.type,
        text: part.type === "text" ? part.text : part.text,
      })),
    chatId,
  });
  // console.log("Received messages:", messages);
  const lastMessages = messages.slice(-10);
  let tokens = 0;
  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      const result = streamText({
        model: registry.languageModel("openai/gpt-4.1-nano"),
        system: `You are T3 Chat, an AI assistant powered by the ${selectedChatModel}
         model. Your role is to assist and engage in conversation while being
         helpful, respectful, and engaging.'
         '- If you are specifically asked about the model you are using, you may
         mention that you use the ${selectedChatModel} model. If you are not
         asked specifically mention it.',
      `,
        messages: convertToModelMessages(lastMessages),
        onError(error) {
          console.error("streamText error:", error);
        },
        onStepFinish({ usage }) {
          tokens += usage.outputTokens || 0;
        },
      });
      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ responseMessage }) => {
      // Save the final message to the database or perform other actions
      await ctx.runMutation(internal.threads.createThread, {
        role: responseMessage.role,
        parts: responseMessage.parts
          .filter((part) => part.type === "text" || part.type === "reasoning")
          .map((part) => ({
            type: part.type,
            text: part.type === "text" ? part.text : part.text,
          })),
        chatId,
        response: {
          modelName: selectedChatModel,
          tokens: tokens,
        },
      });
    },
    onError: () => {
      return "Oops, an error occurred!";
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: new Headers({
      "Access-Control-Allow-Origin": "*",
      Vary: "origin",
    }),
  });
});
