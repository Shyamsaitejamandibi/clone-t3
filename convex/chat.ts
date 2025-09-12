import { gateway } from "@ai-sdk/gateway";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  UIMessage,
} from "ai";
import { httpAction } from "./_generated/server";
import { generateUUID } from "@/lib/utils";
import { api, internal } from "./_generated/api";
import { registry } from "@/lib/ai/models";

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
    selectedChatModel: string;
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
        model: registry.languageModel("openai:openai/gpt-4.1-nano"),
        system: `
      You are a helpful assistant that can search through the user's notes.
      Use the information from the notes to answer questions and provide insights.
      If the requested information is not available, respond with "Sorry, I can't find that information in your notes".
      You can use markdown formatting like links, bullet points, numbered lists, and bold text.
      Provide links to relevant notes using this relative URL structure (omit the base URL): '/notes?noteId=<note-id>'.
      Keep your responses concise and to the point.
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
    onFinish: async ({ responseMessage, messages }) => {
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
