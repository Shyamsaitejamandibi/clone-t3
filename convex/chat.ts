import { gateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { httpAction } from "./_generated/server";
import { StreamId } from "@convex-dev/persistent-text-streaming";

export const streamChat = httpAction(async (ctx, req) => {
  const data = await req.json();
  const { messages, streamId }: { messages: UIMessage[]; streamId: StreamId } =
    data;
  console.log("Received data:", data);
  console.log("Received messages:", messages);
  const lastMessages = messages.slice(-10);
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

  return result.toUIMessageStreamResponse({
    headers: new Headers({
      "Access-Control-Allow-Origin": "*",
      Vary: "origin",
    }),
  });
});
