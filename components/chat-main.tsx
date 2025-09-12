"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";
import { PreviewMessage } from "./message";
import { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { ChatSDKError } from "@/lib/errors";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  /.cloud$/,
  ".site"
);

export function ChatMain({
  userId,
  id,
  initialMessages,
  initialChatModel,
}: {
  id: string;
  userId: string;
  initialMessages: UIMessage[];
  initialChatModel: string;
}) {
  console.log("User ID in ChatMain:", userId);
  const [input, setInput] = useState<string>("");
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<UIMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/chat-stream`,
      fetch: fetchWithErrorHandlers,
      body: { userId: userId },
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            messages: messages,
            selectedChatModel: initialChatModel,
            userId,
            ...body,
          },
        };
      },
    }),
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast(error.message);
      }
    },
  });

  console.log("Messages in ChatMain:", messages);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-0">
        <div className="p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Start a conversation
              </div>
            )}

            {messages.map((message, index) => (
              <PreviewMessage
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ChatInput
        id={id}
        userId={userId}
        input={input}
        setInput={setInput}
        status={status}
        stop={stop}
        messages={messages}
        setMessages={setMessages}
        sendMessage={sendMessage}
      />
    </div>
  );
}
