"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";
import { useChat } from "@ai-sdk/react";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { ChatSDKError } from "@/lib/errors";
import { Messages } from "./messages";
import { ChatMessage } from "@/lib/types";
import { useRouter } from "next/navigation";

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
  initialMessages: ChatMessage[];
  initialChatModel: string;
}) {
  console.log("User ID in ChatMain:", userId);
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
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
    onFinish: () => {
      router.refresh();
    },
  });

  console.log("Messages in ChatMain:", messages);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-0">
        <div className="p-16">
          <Messages
            chatId={id}
            status={status}
            messages={messages}
            setMessages={setMessages}
            regenerate={regenerate}
            selectedModelId={initialChatModel}
            input={input}
            setInput={setInput}
          />
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
        selectedModelId={initialChatModel}
        setMessages={setMessages}
        sendMessage={sendMessage}
      />
    </div>
  );
}
