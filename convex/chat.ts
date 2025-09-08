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
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const streamChat = httpAction(async (ctx, req) => {
  const data = await req.json();
  const { messages, chatId }: { messages: UIMessage[]; chatId: Id<"chats"> } =
    data;
  // console.log("Received data:", data)  ;
  // console.log("Received messages:", messages);
  const lastMessages = messages.slice(-10);
  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      const result = streamText({
        model: gateway("openai/gpt-4.1-nano"),
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
      });
      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ messages }) => {
      // Save the final message to the database or perform other actions
      await ctx.runMutation(internal.threads.createThread, {
        role: messages[messages.length - 1].role,
        parts: messages.flatMap((message) =>
          message.parts
            .filter((part) => part.type === "text" || part.type === "reasoning")
            .map((part) => ({
              text: part.text,
              type: part.type,
            }))
        ),
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
